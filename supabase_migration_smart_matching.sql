-- Smart Matching System Migration
-- Tables for storing user criteria and matching scores

-- Table: smart_matching_criteria (User's search preferences)
CREATE TABLE IF NOT EXISTS smart_matching_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Selected criteria (JSON array of criterion names)
  criteria_selected JSONB DEFAULT '[]',
  
  -- General Criteria
  budget_min INTEGER,
  budget_max INTEGER,
  sectors TEXT[] DEFAULT '{}',
  location TEXT,
  location_flexibility TEXT DEFAULT 'flexible', -- 'strict' | 'flexible'
  cession_types TEXT[] DEFAULT '{}', -- ['cession_simple', 'cession_reprise', etc]
  
  -- Profile Criteria
  employees_min INTEGER,
  employees_max INTEGER,
  
  -- Financial Criteria
  ca_min INTEGER,
  ca_max INTEGER,
  ebitda_margin_min DECIMAL(5,2) DEFAULT 0,
  net_margin_min DECIMAL(5,2) DEFAULT 0,
  net_result_min INTEGER,
  net_result_max INTEGER,
  debt_ratio_max DECIMAL(5,2),
  
  -- Performance Criteria
  ca_growth_min DECIMAL(5,2),
  result_growth_min DECIMAL(5,2),
  client_stability TEXT, -- 'low' | 'medium' | 'high'
  
  -- Potential Criteria
  growth_potential TEXT, -- 'none' | 'low' | 'medium' | 'high'
  synergies_types TEXT[] DEFAULT '{}',
  market_trend TEXT, -- 'contraction' | 'stable' | 'growth'
  technology_level TEXT, -- 'obsolete' | 'dated' | 'current' | 'modern'
  
  -- Additional Criteria
  single_client_risk_max TEXT,
  clientele_types TEXT[] DEFAULT '{}',
  cedant_profile TEXT,
  inventory_status TEXT,
  coaching_required BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT criteria_user_unique UNIQUE(user_id)
);

-- Table: smart_matching_scores (Cache of scoring results)
CREATE TABLE IF NOT EXISTS smart_matching_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  
  score INTEGER CHECK (score >= 0 AND score <= 100),
  score_breakdown JSONB DEFAULT '{}', -- Detailed score per criterion
  explanation TEXT[] DEFAULT '{}', -- Array of explanation lines
  criteria_matched INTEGER DEFAULT 0, -- Number of matched criteria
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT scores_unique UNIQUE(buyer_id, listing_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_smart_criteria_user ON smart_matching_criteria(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_scores_buyer ON smart_matching_scores(buyer_id);
CREATE INDEX IF NOT EXISTS idx_smart_scores_listing ON smart_matching_scores(listing_id);
CREATE INDEX IF NOT EXISTS idx_smart_scores_buyer_score ON smart_matching_scores(buyer_id, score DESC);

-- Triggers to update updated_at
CREATE OR REPLACE FUNCTION update_smart_matching_criteria_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_smart_matching_scores_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER smart_matching_criteria_timestamp
BEFORE UPDATE ON smart_matching_criteria
FOR EACH ROW
EXECUTE FUNCTION update_smart_matching_criteria_timestamp();

CREATE TRIGGER smart_matching_scores_timestamp
BEFORE UPDATE ON smart_matching_scores
FOR EACH ROW
EXECUTE FUNCTION update_smart_matching_scores_timestamp();
