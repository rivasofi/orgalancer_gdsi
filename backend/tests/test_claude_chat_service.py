"""Tests for Claude Chat Service."""

import pytest
from sqlalchemy.orm import Session
from unittest.mock import patch, MagicMock
from app.services.claude_chat_service import ClaudeChatService
from app.models import FreelancerProfile, ExchangeRate


class TestClaudeChatService:
    """Tests for ClaudeChatService."""
    
    @pytest.mark.asyncio
    async def test_calculate_and_explain_usd_freelancer(self, db: Session):
        """Test calculating tariff for USD freelancer and getting explanation."""
        service = ClaudeChatService()
        
        # Create USD freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_chat_usd',
            hourly_rate=100.0,
            currency='USD',
            country='USA'
        )
        db.add(freelancer)
        db.commit()
        
        # Mock Claude API response
        with patch.object(service.client, 'messages') as mock_messages:
            mock_response = MagicMock()
            mock_response.content = [MagicMock(text="Great! You earned $800 USD for 8 hours of work.")]
            mock_response.stop_reason = "end_turn"
            mock_messages.create.return_value = mock_response
            
            # Calculate with explanation
            result = await service.calculate_and_explain(
                db=db,
                user_id='freelancer_chat_usd',
                hours_worked=8.0
            )
            
            # Verify result structure
            assert result['user_id'] == 'freelancer_chat_usd'
            assert result['hours_worked'] == 8.0
            assert 'explanation' in result
            assert 'calculation' in result
            
            # Verify calculation
            calc = result['calculation']
            assert calc['total_usd'] == 800.0
            assert calc['total_local'] == 800.0
            assert calc['exchange_rate'] == 1.0
            
            # Verify Claude was called
            assert mock_messages.create.called
    
    @pytest.mark.asyncio
    async def test_calculate_and_explain_with_conversion(self, db: Session):
        """Test calculating tariff with currency conversion."""
        service = ClaudeChatService()
        
        # Create ARS freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_chat_ars',
            hourly_rate=75.50,
            currency='ARS',
            country='Argentina'
        )
        db.add(freelancer)
        
        # Add exchange rate
        rate = ExchangeRate(
            from_currency='USD',
            to_currency='ARS',
            rate=870.50
        )
        db.add(rate)
        db.commit()
        
        # Mock Claude API
        service_instance = ClaudeChatService()
        with patch.object(service_instance.client, 'messages') as mock_messages:
            mock_response = MagicMock()
            mock_response.content = [MagicMock(text="Excelente! Ganaste $525910 ARS trabajando 8 horas.")]
            mock_response.stop_reason = "end_turn"
            mock_messages.create.return_value = mock_response
            
            result = await service_instance.calculate_and_explain(
                db=db,
                user_id='freelancer_chat_ars',
                hours_worked=8.0
            )
            
            # Verify calculation
            calc = result['calculation']
            assert calc['total_usd'] == 604.0  # 75.50 * 8
            assert calc['exchange_rate'] == 870.50
            
            # Verify explanation exists
            assert len(result['explanation']) > 0
    
    @pytest.mark.asyncio
    async def test_calculate_and_explain_freelancer_not_found(self, db: Session):
        """Test that error is raised for non-existent freelancer."""
        service = ClaudeChatService()
        
        with pytest.raises(ValueError) as exc_info:
            await service.calculate_and_explain(
                db=db,
                user_id='nonexistent_freelancer',
                hours_worked=8.0
            )
        
        assert "not found" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_calculate_and_explain_invalid_hours(self, db: Session):
        """Test that invalid hours are rejected."""
        service = ClaudeChatService()
        
        # Create freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_hours',
            hourly_rate=100.0,
            currency='USD',
            country='USA'
        )
        db.add(freelancer)
        db.commit()
        
        # Test with negative hours
        with pytest.raises(ValueError) as exc_info:
            await service.calculate_and_explain(
                db=db,
                user_id='freelancer_hours',
                hours_worked=-5.0
            )
        
        assert "greater than 0" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_build_explanation_prompt(self, db: Session):
        """Test that explanation prompt is built correctly."""
        service = ClaudeChatService()
        
        # Create freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_prompt',
            hourly_rate=100.0,
            currency='USD',
            country='USA'
        )
        
        # Build tariff result
        tariff_result = {
            'user_id': 'freelancer_prompt',
            'hours_worked': 8.0,
            'hourly_rate_usd': 100.0,
            'exchange_rate': 1.0,
            'total_usd': 800.0,
            'total_local': 800.0,
            'breakdown': {
                'hourly_rate_usd': 100.0,
                'hourly_rate_local': 100.0,
                'source': 'No conversion (already in USD)'
            }
        }
        
        # Build prompt
        prompt = service._build_explanation_prompt(
            freelancer=freelancer,
            tariff_result=tariff_result,
            hours_worked=8.0
        )
        
        # Verify prompt contains relevant information
        assert 'freelancer_prompt' in prompt
        assert '100.0' in prompt
        assert 'USD' in prompt
        assert '8' in prompt
        assert 'friendly' in prompt.lower() or 'explain' in prompt.lower()
