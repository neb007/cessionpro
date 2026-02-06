-- Supabase Setup Script for Cessionpro
-- This script creates all necessary tables and sets up Row Level Security (RLS)

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'buyer', 'seller', 'both'
  company_name TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sector TEXT,
  asking_price DECIMAL(15, 2),
  annual_revenue DECIMAL(15, 2),
  ebitda DECIMAL(15, 2),
  employees INTEGER,
  location TEXT,
  country TEXT DEFAULT 'france',
  region TEXT,
  year_founded INTEGER,
  reason_for_sale TEXT,
  assets_included TEXT[] DEFAULT ARRAY[]::TEXT[],
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'pending', 'sold', 'withdrawn'
  confidential BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  legal_structure TEXT,
  registration_number TEXT,
  lease_info TEXT,
  licenses TEXT,
  financial_years JSONB,
  market_position TEXT,
  competitive_advantages TEXT,
  growth_opportunities TEXT,
  customer_base TEXT,
  buyer_budget_min DECIMAL(15, 2),
  buyer_budget_max DECIMAL(15, 2),
  buyer_sectors_interested TEXT[] DEFAULT ARRAY[]::TEXT[],
  buyer_locations TEXT[] DEFAULT ARRAY[]::TEXT[],
  buyer_employees_min INTEGER,
  buyer_employees_max INTEGER,
  buyer_revenue_min DECIMAL(15, 2),
  buyer_revenue_max DECIMAL(15, 2),
  buyer_investment_available DECIMAL(15, 2),
  buyer_profile_type TEXT,
  buyer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'interested', 'negotiating', 'closed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, business_id)
);

-- Create indexes for better performance
CREATE INDEX idx_businesses_seller_id ON businesses(seller_id);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_country ON businesses(country);
CREATE INDEX idx_businesses_sector ON businesses(sector);
CREATE INDEX idx_leads_buyer_id ON leads(buyer_id);
CREATE INDEX idx_leads_business_id ON leads(business_id);
CREATE INDEX idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Anyone can view active businesses" ON businesses
  FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Sellers can create businesses" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own businesses" ON businesses
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own businesses" ON businesses
  FOR DELETE USING (auth.uid() = seller_id);

-- Leads policies
CREATE POLICY "Buyers can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view leads for their businesses" ON leads
  FOR SELECT USING (auth.uid() IN (SELECT seller_id FROM businesses WHERE id = business_id));

CREATE POLICY "Buyers can create leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = buyer_id);

-- Conversations policies
CREATE POLICY "Participants can view their conversations" ON conversations
  FOR SELECT USING (auth.uid() IN (participant_1_id, participant_2_id));

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_1_id);

CREATE POLICY "Participants can update conversations" ON conversations
  FOR UPDATE USING (auth.uid() IN (participant_1_id, participant_2_id));

-- Messages policies
CREATE POLICY "Senders can view their messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR 
    conversation_id IN (SELECT id FROM conversations WHERE auth.uid() IN (participant_1_id, participant_2_id)));

CREATE POLICY "Users can send messages in their conversations" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id AND 
    conversation_id IN (SELECT id FROM conversations WHERE auth.uid() IN (participant_1_id, participant_2_id)));

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
