"""Initial migration: Create freelancer_profiles and exchange_rates tables

Revision ID: 001_initial
Revises: 
Create Date: 2026-05-11 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create freelancer_profiles table
    op.create_table(
        'freelancer_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('hourly_rate', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(), nullable=False),
        sa.Column('country', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id'),
    )
    op.create_index(op.f('ix_freelancer_profiles_id'), 'freelancer_profiles', ['id'], unique=False)
    op.create_index(op.f('ix_freelancer_profiles_user_id'), 'freelancer_profiles', ['user_id'], unique=True)

    # Create exchange_rates table
    op.create_table(
        'exchange_rates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('from_currency', sa.String(), nullable=False),
        sa.Column('to_currency', sa.String(), nullable=False),
        sa.Column('rate', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('from_currency', 'to_currency', name='uq_currency_pair'),
    )
    op.create_index(op.f('ix_exchange_rates_id'), 'exchange_rates', ['id'], unique=False)
    op.create_index(op.f('ix_exchange_rates_from_currency'), 'exchange_rates', ['from_currency'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_exchange_rates_from_currency'), table_name='exchange_rates')
    op.drop_index(op.f('ix_exchange_rates_id'), table_name='exchange_rates')
    op.drop_table('exchange_rates')
    
    op.drop_index(op.f('ix_freelancer_profiles_user_id'), table_name='freelancer_profiles')
    op.drop_index(op.f('ix_freelancer_profiles_id'), table_name='freelancer_profiles')
    op.drop_table('freelancer_profiles')
