-- Supabase Migration: Add buyer-related fields to businesses table
-- This migration adds fields for buyer profiles and criteria in business listings

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_budget_min DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_budget_max DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_sectors_interested TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_locations TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_employees_min INTEGER;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_employees_max INTEGER;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_revenue_min DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_revenue_max DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_investment_available DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_profile_type TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_notes TEXT;
