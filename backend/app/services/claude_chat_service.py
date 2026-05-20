"""Claude AI Chat Service for real-time tariff calculation explanations."""

import logging
import json
from typing import Dict, Optional
from anthropic import Anthropic
from sqlalchemy.orm import Session
from app.models import FreelancerProfile
from app.services.tariff_service import TariffCalculationService

logger = logging.getLogger(__name__)

# Claude model to use
CLAUDE_MODEL = "claude-3-5-sonnet-20241022"


class ClaudeChatService:
    """Service for using Claude to explain tariff calculations to freelancers."""
    
    def __init__(self):
        """Initialize tariff service (client will be created when needed)."""
        self.tariff_service = TariffCalculationService()
        self._client = None
    
    @property
    def client(self):
        """Lazy-load Anthropic client."""
        if self._client is None:
            self._client = Anthropic()
        return self._client
        
    async def calculate_and_explain(
        self,
        db: Session,
        user_id: str,
        hours_worked: float
    ) -> Dict:
        """
        Calculate tariff and ask Claude to explain the results in a friendly way.
        
        This is the main method: it calculates the tariff in real-time,
        gets the exchange rate, and uses Claude to format a nice explanation.
        
        Args:
            db: SQLAlchemy session
            user_id: Freelancer user ID
            hours_worked: Number of hours worked
        
        Returns:
            dict: {
                'user_id': str,
                'hours_worked': float,
                'calculation': {...},  # Full tariff calculation details
                'explanation': str,     # Claude's friendly explanation
                'freelancer_name': str
            }
        
        Raises:
            ValueError: If freelancer not found
            Exception: If tariff calculation or Claude API fails
        """
        # Get freelancer profile
        freelancer = db.query(FreelancerProfile).filter(
            FreelancerProfile.user_id == user_id
        ).first()
        
        if not freelancer:
            raise ValueError(f"Freelancer with user_id '{user_id}' not found")
        
        logger.info(f"📊 Starting tariff calculation for {user_id}: {hours_worked} hours")
        
        # Step 1: Calculate tariff in real-time
        try:
            tariff_result = await self.tariff_service.calculate_tariff(
                db, user_id, hours_worked
            )
            logger.info(f"✅ Calculated tariff: ${tariff_result['total_usd']} USD")
        except Exception as e:
            logger.error(f"❌ Tariff calculation failed: {e}")
            raise
        
        # Step 2: Ask Claude to explain the calculation
        explanation = await self._get_claude_explanation(
            freelancer=freelancer,
            tariff_result=tariff_result,
            hours_worked=hours_worked
        )
        
        logger.info(f"✅ Claude generated explanation for {user_id}")
        
        return {
            'user_id': user_id,
            'hours_worked': hours_worked,
            'calculation': tariff_result,
            'explanation': explanation,
            'freelancer_name': user_id
        }
    
    async def _get_claude_explanation(
        self,
        freelancer: FreelancerProfile,
        tariff_result: Dict,
        hours_worked: float
    ) -> str:
        """
        Ask Claude to explain the tariff calculation in a friendly way.
        
        Args:
            freelancer: FreelancerProfile object
            tariff_result: Result from calculate_tariff()
            hours_worked: Number of hours
        
        Returns:
            str: Claude's explanation (or fallback if API unavailable)
        """
        # Build the prompt for Claude
        prompt = self._build_explanation_prompt(
            freelancer=freelancer,
            tariff_result=tariff_result,
            hours_worked=hours_worked
        )
        
        try:
            logger.info(f"🤖 Asking Claude to explain calculation")
            
            # Simple API call - just one turn, no history
            response = self.client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=512,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            explanation = response.content[0].text
            logger.info(f"✅ Claude explanation generated")
            
            return explanation
        
        except Exception as e:
            logger.error(f"⚠️ Claude API error: {e}")
            # Fallback explanation when Claude is unavailable
            total_usd = tariff_result['total_usd']
            total_local = tariff_result['total_local']
            exchange_rate = tariff_result['exchange_rate']
            currency = freelancer.currency
            
            fallback = f"""Based on your hourly rate of ${freelancer.hourly_rate} USD/hour and working {hours_worked} hours, your total earnings are ${total_usd:.2f} USD (or {total_local:,.2f} {currency} at the current exchange rate of {exchange_rate:.2f}). This calculation includes all applicable taxes and local conversions for your country."""
            
            logger.info(f"📝 Using fallback explanation (Claude unavailable)")
            return fallback
    
    def _build_explanation_prompt(
        self,
        freelancer: FreelancerProfile,
        tariff_result: Dict,
        hours_worked: float
    ) -> str:
        """
        Build a prompt for Claude to explain the calculation.
        
        Args:
            freelancer: FreelancerProfile
            tariff_result: Tariff calculation result
            hours_worked: Number of hours
        
        Returns:
            str: Prompt for Claude
        """
        hourly_rate = freelancer.hourly_rate
        currency = freelancer.currency
        total_usd = tariff_result['total_usd']
        total_local = tariff_result['total_local']
        exchange_rate = tariff_result['exchange_rate']
        breakdown = tariff_result.get('breakdown', {})
        
        # Build the calculation summary
        calc_summary = f"""
Tariff Calculation Results:
- Freelancer: {freelancer.user_id}
- Country: {freelancer.country}
- Hourly Rate: ${hourly_rate} USD/hour
- Currency: {currency}
- Hours Worked: {hours_worked} hours
- Exchange Rate (USD → {currency}): {exchange_rate:.2f}
- Total in USD: ${total_usd:.2f}
- Total in {currency}: {total_local:,.2f}

Breakdown:
- Hourly Rate USD: ${breakdown.get('hourly_rate_usd', hourly_rate):.2f}
- Hourly Rate {currency}: {breakdown.get('hourly_rate_local', hourly_rate * exchange_rate):,.2f}
- Hours: {hours_worked}
- Source of Exchange Rate: {breakdown.get('source', 'Unknown')}
"""
        
        prompt = f"""You are a helpful financial assistant for freelancers.

A freelancer just calculated their earnings. Please explain the calculation 
in a friendly, encouraging, and clear way. 

The freelancer has a base hourly rate, and their local currency differs from USD.
Explain how the exchange rate affects their earnings.

Be conversational and positive, but accurate with numbers. Keep it brief (2-3 sentences max).

{calc_summary}

Now write a friendly explanation of these results:"""
        
        return prompt


# Global service instance
claude_service = ClaudeChatService()
