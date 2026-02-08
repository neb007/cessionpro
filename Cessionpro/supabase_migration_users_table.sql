-- ==========================================
-- MIGRATION: Create public.users table
-- ==========================================
-- This table stores user profile information
-- Linked to Supabase auth.users via id = auth.uid()

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  location VARCHAR(255),
  avatar_url VARCHAR(500),
  company_name VARCHAR(255),
  user_type VARCHAR(50) DEFAULT 'buyer', -- 'buyer', 'seller', 'both'
  
  -- Profile fields
  sectors_interest VARCHAR(255)[] DEFAULT '{}',
  budget_min NUMERIC,
  budget_max NUMERIC,
  experience TEXT,
  visible_in_directory BOOLEAN DEFAULT true,
  preferred_language VARCHAR(10) DEFAULT 'fr',
  
  -- Messaging settings
  notification_emails_enabled BOOLEAN DEFAULT true, -- Toggle email notifications
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy: users can see their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy: users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at_trigger ON public.users;
CREATE TRIGGER update_users_updated_at_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
