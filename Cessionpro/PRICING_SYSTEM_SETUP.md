# 💰 Cessionpro Pricing System - Complete Setup Guide

## 🎯 Overview

Your Cessionpro platform now has a complete pricing system ready to go! This guide walks you through the final setup steps to activate photo and contact credits functionality.

---

## ✅ What Has Been Implemented

### 1. **Pricing Constants** (`/src/constants/pricing.js`)
- ✅ All pricing tiers defined (Contacts, Photos, Premium)
- ✅ Multi-language support (FR & EN)
- ✅ Helper functions for price formatting
- ✅ Package calculations ready

### 2. **Database Schema Updates** (`pricing-schema-migration.sql`)
- ✅ Credit columns added to `profiles` table:
  - `photos_remaining_balance` (INT) - Default: 1 free photo
  - `contact_credits_balance` (INT) - Default: 0
  - `total_photos_purchased` (INT)
  - `total_contacts_purchased` (INT)
  - `subscription_expiry` (TIMESTAMP)
  - Payment tracking: `stripe_customer_id`, `last_payment_date`, `total_spent`

- ✅ New tables created:
  - `credit_transactions` - Track all purchases
  - `credit_logs` - Audit trail of credit changes

### 3. **React Components**
- ✅ `CreditDisplay.jsx` - Shows user's current credits
- ✅ `PricingModal.jsx` - Beautiful pricing modal with all packages

### 4. **Custom Hook**
- ✅ `useUserCredits.js` - Manage credits:
  - Check credit balance
  - Deduct credits after use
  - Add credits after purchase
  - Full audit logging

### 5. **Service Updates**
- ✅ `imageService.js` - Photo credit checking
  - Validates credits before upload
  - Deducts credits automatically
  - Logs transactions

### 6. **Storage Bucket Fix**
- ✅ Updated bucket name from `'business-images'` to `'Cession'` in `base44Client.js`

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `/Cessionpro/pricing-schema-migration.sql`
5. Click **Run**
6. Verify success message appears

**Expected Output:**
```
Your migration has been executed successfully.
```

### Step 2: Create the Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it exactly: **`Cession`** (case-sensitive)
4. **Toggle**: "Make it public" → ON
5. Click **Create Bucket**

### Step 3: Set Storage CORS (Optional but Recommended)

If you get CORS errors with file uploads:

1. Go to **Storage** settings
2. Find **CORS Configuration**
3. Add your domain:
```json
[
  {
    "origin": ["http://localhost:5173", "https://yourdomain.com"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["*"]
  }
]
```

### Step 4: Test the System

1. **Start your app**: `npm run dev`
2. **Log in** as a user
3. **Try uploading photos** when creating a listing
4. **Check browser console** for any errors
5. **Verify credits** in Supabase:
   ```sql
   SELECT id, photos_remaining_balance, contact_credits_balance 
   FROM profiles 
   LIMIT 5;
   ```

---

## 📱 Using the Components in Your Pages

### Display User Credits

```jsx
import CreditDisplay from '@/components/CreditDisplay';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useLanguage } from '@/components/i18n/LanguageContext';

export default function MyPage() {
  const { credits } = useUserCredits();
  const { language } = useLanguage();
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <>
      <CreditDisplay 
        credits={credits}
        language={language}
        onBuyClick={(type) => setPricingOpen(true)}
      />
      
      <PricingModal
        open={pricingOpen}
        onOpenChange={setPricingOpen}
        type="photos"
        language={language}
        onPurchase={(package) => {
          // TODO: Integrate Stripe/PayPal here
          console.log('User selected:', package);
        }}
      />
    </>
  );
}
```

### Check Credits Before Action

```jsx
import { useUserCredits } from '@/hooks/useUserCredits';

export default function ContactButton() {
  const { hasContactCredits, deductContactCredit } = useUserCredits();

  const handleContact = async () => {
    if (!hasContactCredits()) {
      alert('No credits available. Please buy contacts first.');
      return;
    }

    // Make the contact
    await initiateContact();

    // Deduct credit
    await deductContactCredit();
  };

  return <button onClick={handleContact}>Contact Seller</button>;
}
```

---

## 💳 Stripe Integration (Future)

When you're ready to accept payments:

1. **Create Stripe account**: https://stripe.com
2. **Install Stripe SDK**:
   ```bash
   npm install @stripe/react-stripe-js @stripe/js
   ```

3. **Create payment handler**:
```jsx
const handlePayment = async (package) => {
  // 1. Create Stripe PaymentIntent on backend
  // 2. Confirm payment with Stripe
  // 3. On success, call addPhotoCredits() or addContactCredits()
  // 4. Credit automatically added to user's account
};
```

4. **Update `PricingModal.jsx`** `onPurchase` callback to integrate Stripe

---

## 📊 Database Schema Reference

### profiles table additions:
```sql
photos_remaining_balance INTEGER DEFAULT 1
contact_credits_balance INTEGER DEFAULT 0
total_photos_purchased INTEGER DEFAULT 0
total_contacts_purchased INTEGER DEFAULT 0
active_subscriptions JSONB DEFAULT '{}'
subscription_expiry TIMESTAMP
stripe_customer_id TEXT
last_payment_date TIMESTAMP
total_spent DECIMAL(15, 2) DEFAULT 0
```

### credit_transactions table:
```
id (UUID)
user_id (FK to auth.users)
transaction_type (contact_purchase | photo_purchase | subscription | refund)
package_id (TEXT) - 'pack5', 'pack10', etc.
quantity (INT)
amount (DECIMAL)
currency (TEXT) - Default: 'EUR'
payment_method (TEXT)
stripe_payment_intent_id (TEXT)
status (pending | completed | failed | refunded)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### credit_logs table:
```
id (UUID)
user_id (FK to auth.users)
credit_type (photos | contacts)
amount_change (INT) - Positive or negative
previous_balance (INT)
new_balance (INT)
reason (TEXT)
business_id (FK to businesses, nullable)
created_at (TIMESTAMP)
```

---

## 🔍 Troubleshooting

### Issue: "Bucket not found" error
**Solution**: Verify bucket name is exactly `Cession` (case-sensitive)

### Issue: Photos upload but credits not deducted
**Solution**: Ensure `pricing-schema-migration.sql` was run successfully

### Issue: Users see 0 contacts, can't buy
**Solution**: 
1. Database migration needs to complete
2. Wait 30 seconds for Supabase schema cache refresh
3. Hard refresh browser (Ctrl+F5)

### Issue: CORS errors on file upload
**Solution**: Check Storage CORS configuration in Supabase

---

## 📋 Pricing Tiers (Reference)

### Contacts 🤝
| Package | Quantity | Price | Unit Price | Savings |
|---------|----------|-------|-----------|---------|
| Single | 1 | €19.99 | €19.99 | - |
| Pack 5 | 5 | €79.00 | €15.80 | 21% |
| Pack 8 | 8 | €119.00 | €14.87 | 26% |
| Pack 10 | 10 | €159.00 | €15.90 | 20% |

### Photos 📸
| Package | Quantity | Price | Best For |
|---------|----------|-------|----------|
| Pack 5 | 5 | €9.99 | Small businesses |
| Pack 15 | 15 | €19.99 | Professional listings |

### Premium 🎁
| Feature | Price | Type |
|---------|-------|------|
| Smart Matching IA | €29.99 | Monthly |
| Data Room | €9.99 | One-time |
| NDA Protection | €39.99 | One-time |

---

## ✨ Next Steps

1. ✅ Run the SQL migration
2. ✅ Create the `Cession` storage bucket
3. ✅ Test upload functionality
4. ✅ Verify credits are deducted correctly
5. 🔄 Integrate Stripe/PayPal for real payments
6. 🔄 Add pricing prompts to UI components
7. 🔄 Set up email notifications for purchases

---

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Verify Supabase tables exist: `SELECT table_name FROM information_schema.tables WHERE table_schema='public';`
3. Check logs: `SELECT * FROM credit_logs ORDER BY created_at DESC LIMIT 10;`

---

## 🎉 You're All Set!

Your pricing system is ready. Next, integrate Stripe/PayPal to accept real payments, and start monetizing your platform! 🚀
