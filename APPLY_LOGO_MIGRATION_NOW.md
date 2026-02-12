# ⚠️ URGENT: Apply Logo Migration

**The logo won't display until you apply this migration!**

## Steps to Apply:

### 1. Apply the migration to Supabase
Run this SQL in Supabase SQL Editor:

```sql
-- Add logo fields to business table
ALTER TABLE business
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS show_logo_in_listings BOOLEAN DEFAULT false;
```

**File**: `/supabase_migration_add_logo_to_business_table.sql`

### 2. Verify the migration
Check that columns exist:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name='business' AND column_name IN ('logo_url', 'show_logo_in_listings');
```

## After Migration:

The logo will:
- ✅ Display in BusinessDetails.jsx (bottom of sidebar)
- ✅ Display in BusinessCard.jsx (right of location)
- ✅ Only show if `show_logo_in_listings = true`

## How Logo Gets Populated:

1. User uploads logo in `/Profile.jsx` → saved to `profiles.logo_url`
2. User activates toggle `show_logo_in_listings` → saved to `profiles.show_logo_in_listings`
3. When user creates/updates business → logo copied to `business.logo_url` + `show_logo_in_listings`
4. Logo displays on BusinessCard and BusinessDetails
