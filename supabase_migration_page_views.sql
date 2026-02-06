-- Create page_views table for IP-based view tracking
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  visitor_ip VARCHAR(45) NOT NULL,
  creator_email VARCHAR(255),
  viewed_at DATE DEFAULT CURRENT_DATE
);

-- Create unique index for daily tracking (one view per IP per day per business)
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_views_daily_unique 
  ON page_views(business_id, visitor_ip, viewed_at);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_business_id ON page_views(business_id);
CREATE INDEX IF NOT EXISTS idx_page_views_business_ip ON page_views(business_id, visitor_ip);
