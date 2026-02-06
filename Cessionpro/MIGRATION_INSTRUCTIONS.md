# 🚀 Supabase Schema Migration Instructions

## Issue Fixed
Your application was getting this error:
```
Could not find the 'buyer_budget_max' column of 'businesses' in the schema cache
Could not find the 'type' column of 'businesses' in the schema cache
```

## Root Cause
The `businesses` table is missing 12 columns that the API expects.

## Solution - Choose One Method

### ✅ Option 1: Manual SQL Execution (Recommended - Fastest & Guaranteed to Work)

**Steps:**
1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Open `migration.sql` file from this directory and copy all content
5. Paste it into the Supabase SQL Editor
6. Click **Run**
7. Wait for success message
8. Refresh your browser (Ctrl+F5)

**Expected Output:**
```
Your migration has been applied successfully!
```

---

### Option 2: Using Node.js Migration Script

```bash
cd /home/ubuntu/Bureau/Cessionpro/Cessionpro
node run-migration.js
```

This script uses the same connection pattern as your existing `test-supabase.js` script.

---

### Option 3: Direct Supabase CLI (if installed)

```bash
supabase db push
```

## Columns Being Added

The following 12 columns will be added to the `businesses` table:

1. **type** - TEXT (cession/acquisition type)
2. **buyer_budget_min** - DECIMAL (minimum buyer budget)
3. **buyer_budget_max** - DECIMAL (maximum buyer budget)
4. **buyer_sectors_interested** - TEXT[] (sectors buyer is interested in)
5. **buyer_locations** - TEXT[] (locations buyer is interested in)
6. **buyer_employees_min** - INTEGER (minimum employee count)
7. **buyer_employees_max** - INTEGER (maximum employee count)
8. **buyer_revenue_min** - DECIMAL (minimum revenue requirement)
9. **buyer_revenue_max** - DECIMAL (maximum revenue requirement)
10. **buyer_investment_available** - DECIMAL (investment capital available)
11. **buyer_profile_type** - TEXT (buyer profile classification)
12. **buyer_notes** - TEXT (additional buyer notes)

## What Happens Next

1. ✅ Columns are added to the database
2. ✅ Supabase schema cache refreshes (up to 30 seconds)
3. ✅ Your application can now create and duplicate listings

## Verification

After running the migration:

1. Refresh your browser
2. Try creating a new business listing
3. Try duplicating a listing
4. Both operations should work without errors

## Still Having Issues?

If you continue to see the PGRST204 error:

1. **Clear your browser cache** - Press Ctrl+Shift+Delete
2. **Force refresh** - Press Ctrl+F5
3. **Wait 60 seconds** - Supabase schema cache can take time to update
4. **Check the database directly** - Run this in Supabase SQL Editor:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'businesses' 
ORDER BY column_name;
```

This will show all columns in your businesses table.
