-- Create business_logos table to store logo info
CREATE TABLE IF NOT EXISTS public.business_logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id TEXT NOT NULL UNIQUE,
  seller_id UUID NOT NULL,
  logo_url TEXT,
  show_logo_in_listings BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.business_logos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all business logos" 
  ON public.business_logos 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can manage their own business logos" 
  ON public.business_logos 
  FOR UPDATE 
  TO authenticated 
  USING (seller_id = auth.uid());

CREATE POLICY "Users can insert their own business logos" 
  ON public.business_logos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (seller_id = auth.uid());
