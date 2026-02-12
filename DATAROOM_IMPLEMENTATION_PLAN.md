# 📁 DATAROOM IMPLEMENTATION PLAN - CessionPro

**Status:** PLANNED (To be implemented in Phase 2)  
**Target Release:** Q2 2026  
**Estimated Timeline:** 2-3 weeks of development

---

## 📋 PROJECT OVERVIEW

A secure document sharing platform for sellers to upload and share business documents (financial records, legal docs, etc.) with interested buyers, with granular access control and audit trail tracking.

### Key Features
1. **Security Layer**: NDA signature requirement before access
2. **Document Management**: Organized folder structure with auto-indexation
3. **Access Control**: Granular permissions per buyer (view only, download, admin)
4. **Audit Trail**: Complete history of who viewed what and when
5. **Subscription Model**: 9.99€/year per seller to unlock feature
6. **Watermarking**: PDF watermarks with buyer email (future enhancement)

---

## 🏗 ARCHITECTURE

### Database Schema

```sql
-- Dataroom Tables
CREATE TABLE datarooms (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES seller_profiles(seller_id),
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active' -- 'active', 'archived'
);

CREATE TABLE dataroom_documents (
  id UUID PRIMARY KEY,
  dataroom_id UUID REFERENCES datarooms(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT,
  category TEXT, -- 'Juridique', 'Fiscal', 'Social', 'Comptable', 'Autres'
  document_number TEXT, -- '1.1', '1.2', '2.1' (auto-indexed)
  file_path TEXT, -- Supabase Storage path
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  uploaded_by UUID,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dataroom_access (
  id UUID PRIMARY KEY,
  dataroom_id UUID REFERENCES datarooms(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES buyer_profiles(buyer_id),
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  nda_signed BOOLEAN DEFAULT false,
  nda_signed_at TIMESTAMP,
  nda_document_id TEXT,
  access_level TEXT DEFAULT 'view_only', -- 'view_only', 'download', 'admin'
  granted_at TIMESTAMP,
  expires_at TIMESTAMP, -- Optional expiration
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dataroom_access_requests (
  id UUID PRIMARY KEY,
  dataroom_id UUID,
  buyer_id UUID,
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  request_date TIMESTAMP DEFAULT NOW(),
  response_date TIMESTAMP,
  responded_by UUID
);

CREATE TABLE dataroom_audit (
  id UUID PRIMARY KEY,
  dataroom_id UUID,
  user_id UUID,
  user_email TEXT,
  user_type TEXT, -- 'seller', 'buyer'
  action TEXT, -- 'viewed', 'downloaded', 'shared', 'document_uploaded', 'access_granted'
  document_id UUID,
  document_name TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  session_id TEXT
);

-- Extension to seller_profiles
ALTER TABLE seller_profiles ADD COLUMN (
  dataroom_subscription_active BOOLEAN DEFAULT false,
  dataroom_subscription_expires_at TIMESTAMP,
  dataroom_subscription_stripe_id TEXT,
  dataroom_subscription_created_at TIMESTAMP
);
```

---

## 🔧 BACKEND SERVICES

### 1. `src/services/dataroomService.js`

```javascript
// Core Dataroom Operations
export const dataroomService = {
  
  // Dataroom Management
  async createDataroom(businessId) {
    // Auto-create new dataroom with each business listing
    // Reference: One dataroom per business
  },
  
  async getDataroom(businessId) {
    // Fetch dataroom and all associated metadata
  },
  
  async archiveDataroom(dataroomId) {
    // Soft delete - keep history but disable access
  },
  
  // Document Operations
  async uploadDocument(dataroomId, file, category, userId) {
    // 1. Validate file type and size (PDF, DOC, DOCX, XLSX)
    // 2. Generate unique filename
    // 3. Upload to Supabase Storage
    // 4. Auto-index document based on category
    // 5. Create database record
    // 6. Log audit trail
  },
  
  async deleteDocument(documentId, userId) {
    // Soft delete (mark as deleted, keep in audit)
    // Remove from storage
    // Update database
  },
  
  async listDocuments(dataroomId) {
    // Return sorted by category, then by document_number
    // Format: { category: "Juridique", documents: [...] }
  },
  
  async downloadDocument(documentId, userId) {
    // Check permissions
    // Generate download URL (with expiration)
    // Log download action
  },
  
  // Subscription Management
  async checkSubscriptionStatus(sellerId) {
    // Returns { active, expiresAt, daysRemaining }
  },
  
  async activateSubscription(sellerId, stripeSessionId) {
    // Called by Stripe webhook after successful payment
    // Sets dataroom_subscription_active = true
    // Sets expiration date = NOW + 1 year
  },
  
  async deactivateSubscription(sellerId) {
    // Called on expiration or cancellation
    // Revokes all buyer access
    // Sends notification to seller
  },
  
  async renewSubscription(sellerId) {
    // Extends subscription by 1 year
  }
};
```

### 2. `src/services/dataroomAccessService.js`

```javascript
export const dataroomAccessService = {
  
  async requestAccess(dataroomId, buyerId, message = '') {
    // Buyer requests access from seller
    // Creates access_requests record
    // Sends notification to seller
  },
  
  async approveAccessRequest(requestId) {
    // Seller approves buyer request
    // Creates dataroom_access record
    // Creates NDA document
    // Sends notification to buyer
  },
  
  async rejectAccessRequest(requestId, reason) {
    // Seller rejects buyer request
    // Sends notification with reason
  },
  
  async grantDirectAccess(dataroomId, buyerId, accessLevel = 'view_only') {
    // Seller directly grants access (without request)
  },
  
  async revokeAccess(dataroomId, buyerId) {
    // Remove buyer access
    // Log in audit trail
  },
  
  async updateAccessLevel(accessId, newLevel) {
    // Change permission level
  },
  
  async getPendingRequests(dataroomId) {
    // Get all pending access requests
  },
  
  async getAccessedBuyers(dataroomId) {
    // Get list of buyers with active access
  }
};
```

### 3. `src/services/ndaService.js`

```javascript
export const ndaService = {
  
  async generateNDA(dataroomId, buyerId) {
    // Generate NDA from template
    // Fill in buyer name, date, etc.
    // Create document record
  },
  
  async signNDA(accessId, buyerId, signature) {
    // Record NDA signature
    // Update dataroom_access.nda_signed = true
    // Unlock all documents for buyer
    // Send confirmation email
  },
  
  async hasSignedNDA(dataroomId, buyerId) {
    // Boolean check
  },
  
  async getNDADocument(accessId) {
    // Get NDA content/PDF for display
  },
  
  async getNDAHistory(dataroomId) {
    // Get all signatures for dataroom
  }
};
```

### 4. `src/services/dataroomAuditService.js`

```javascript
export const dataroomAuditService = {
  
  async logAction(dataroomId, userId, action, documentId = null) {
    // Record all actions: viewed, downloaded, uploaded, shared
    // Capture IP, timestamp, user email
  },
  
  async getAuditTrail(dataroomId, filters = {}) {
    // Get paginated audit history
    // Filters: dateRange, userId, action, documentId
    // Format: timestamp, user, action, document, details
  },
  
  async exportAuditTrail(dataroomId) {
    // Generate CSV/PDF report of all activity
  },
  
  async getAccessHistory(dataroomId, buyerId) {
    // Get all activity by specific buyer
  },
  
  async getDocumentViewers(documentId) {
    // Get all buyers who have viewed this document
  }
};
```

### 5. `src/services/stripeService.js` (Future Implementation)

```javascript
export const stripeService = {
  
  async createDataroomCheckout(sellerId) {
    // Create Stripe Checkout session for 9.99€/year
    // Return session ID and redirect URL
  },
  
  async handleSubscriptionEvent(event) {
    // Webhook handler for Stripe events
    // charge.succeeded → activateSubscription()
    // customer.subscription.deleted → deactivateSubscription()
    // invoice.payment_failed → sendRenewalReminder()
  },
  
  async sendRenewalReminder(sellerId) {
    // Email seller 7 days before expiration
    // Provide renewal link
  },
  
  async checkExpirations() {
    // Cron job to check for expired subscriptions
    // Deactivate and notify
  },
  
  async getSubscriptionStatus(sellerId) {
    // Get Stripe subscription details
  }
};
```

---

## 🎨 FRONTEND COMPONENTS

### Component Structure

```
src/components/dataroom/
├── DataroomPaywall.jsx          # "Unlock Dataroom" card (vendor)
├── DataroomManager.jsx          # Main management interface (vendor)
├── DocumentUploader.jsx         # Drag-drop file upload
├── DocumentList.jsx            # Organized document list
├── DocumentViewer.jsx          # PDF/document viewer
├── AccessPermissions.jsx       # Manage buyer access
├── AccessRequests.jsx          # Pending approvals
├── NDAModal.jsx               # NDA signature flow
├── AuditTrail.jsx            # View activity history
├── DataroomStatus.jsx        # Subscription status display
└── DataroomSection.jsx       # Buyer-side view component
```

### 1. DataroomManager.jsx (Vendor Interface)

**Location:** Show button/link in MyListings.jsx

```jsx
// Main interface with 4 tabs:
// Tab 1: Documents
//   - Upload area (drag-drop or file picker)
//   - Documents organized by category (Juridique, Fiscal, Social, Comptable)
//   - Auto-indexing: 1.1, 1.2, 2.1, etc.
//   - Delete/edit actions

// Tab 2: Share & Access
//   - Pending access requests → Approve/Reject
//   - List of buyers with access
//   - NDA signature status
//   - Access level assignment
//   - Revoke button

// Tab 3: Audit Trail
//   - Timeline of who viewed/downloaded what
//   - Filters: date range, user, action, document
//   - Export option

// Tab 4: Settings
//   - Subscription status
//   - Renewal date
//   - Manage categories
//   - Document retention policy
```

### 2. DataroomSection.jsx (Buyer-Side, in BusinessDetails)

```jsx
// Shows in BusinessDetails page if Dataroom exists

// State 1: No Access
// - "Request Access" button
// - Message: "Ask seller to grant Dataroom access"

// State 2: Access Pending Approval
// - Message: "Awaiting seller approval"
// - Cancel button

// State 3: Access + No NDA Signed
// - NDAModal popup
// - Read NDA content
// - "I Accept" checkbox + signature
// - Sign button

// State 4: Access + NDA Signed
// - Document list with categories
// - PDF Viewer (in-browser)
// - Download button (based on permissions)
// - Watermarked: "Consulté par: buyer@email.com"
```

### 3. NDAModal.jsx

```jsx
// Modal with:
// - NDA text/template
// - Buyer name, date, signature line
// - "I accept these terms" checkbox
// - Sign button
// - On sign:
//   - POST to ndaService.signNDA()
//   - Close modal
//   - Unlock documents
//   - Send confirmation to seller
```

---

## 📱 USER FLOWS

### Vendor Flow: Unlock Dataroom

```
1. Vendor goes to MyListings
2. Sees "🔒 Dataroom - 9.99€/year" for each listing
3. Clicks → Dataroom page loads
4. Sees paywall: "Unlock Dataroom Feature"
   - Features listed
   - Price: 9.99€/year
   - "Pay with Stripe" button
5. Stripe checkout (NOT IMPLEMENTED YET)
6. After payment:
   - seller.dataroom_subscription_active = true
   - seller.dataroom_subscription_expires_at = NOW + 1 year
   - Shows DataroomManager interface
```

### Vendor Flow: Upload Documents

```
1. Opens DataroomManager → Documents tab
2. Drag-drop or select files
3. Assigns category (Juridique, Fiscal, Social, Comptable)
4. Files uploaded to Supabase Storage
5. Auto-indexed: category 1 = "1.1", "1.2", etc.
6. Document list shows all files
7. Can delete, rename, or move to different category
8. Activity logged in audit trail
```

### Vendor Flow: Share with Buyer

```
1. DataroomManager → Share & Access tab
2. Search for buyer email
3. Options:
   Option A: "Request from Buyer"
   - Buyer must request access first
   Option B: "Send Direct Link"
   - Generate shareable link
   Option C: "Add Buyer Manually"
   - Select permission level
   - Buyer gets notification

4. Buyer gets email: "Seller X granted you Dataroom access"
5. Buyer goes to BusinessDetails
6. Clicks "View Dataroom" → NDA Modal
7. Signs NDA
8. Gets access
9. Seller sees in audit trail:
   - "Buyer signed NDA on 12/02/2026 14:30"
   - "Buyer viewed document X"
   - "Buyer downloaded document Y"
```

### Buyer Flow: Request Access

```
1. Views BusinessDetails
2. Notices Dataroom icon/section
3. If no access yet:
   - Sees "Request Access" button
   - Clicks → Opens form
   - Writes message (optional)
   - Sends request
4. Gets notification when seller approves/rejects
5. If approved → NDA flow (see below)
```

### Buyer Flow: Access Documents

```
1. Seller granted access
2. Buyer goes to BusinessDetails
3. Clicks "View Dataroom"
4. Modal shows NDA
5. Reads terms
6. Checks "I accept"
7. Signs (signs with current date/time)
8. NDA recorded in database
9. Documents load with categories
10. Can view PDFs in browser (watermarked)
11. Can download if permission allows
12. All actions logged in audit trail
```

### Subscription Renewal

```
Day 360: Seller gets email
- "Your Dataroom subscription expires in 7 days"
- "Renew now" button → Stripe

Day 365: Subscription expires
- seller.dataroom_subscription_active = false
- All buyers lose access
- Page shows: "Subscription expired - Renew"

Seller renews:
- Pays 9.99€
- subscription_expires_at = NOW + 1 year
- Access restored for all buyers
```

---

## 🔐 SECURITY CONSIDERATIONS

### File Upload Security
- Validate file type (whitelist: PDF, DOC, DOCX, XLSX, PPT)
- Validate file size (max 50MB)
- Scan for malware (optional: VirusTotal API)
- Encrypt files at rest in Supabase Storage
- Generate signed URLs for downloads

### Access Control
- NDA signature required before viewing
- Expire access links after 30 days (configurable)
- Log all access attempts (successful and failed)
- IP address logging for detecting suspicious activity
- Session-based access (lost on logout)

### Data Privacy
- Watermarking: "Viewed by: buyer@email.com" on PDFs
- No caching of documents
- HTTPS only
- Audit trail cannot be modified
- GDPR compliant (right to deletion after retention period)

---

## 📊 DATABASE INDEXING

For optimal performance, add these indexes:

```sql
CREATE INDEX idx_datarooms_seller_id ON datarooms(seller_id);
CREATE INDEX idx_datarooms_business_id ON datarooms(business_id);
CREATE INDEX idx_documents_dataroom_id ON dataroom_documents(dataroom_id);
CREATE INDEX idx_documents_category ON dataroom_documents(category);
CREATE INDEX idx_access_dataroom_buyer ON dataroom_access(dataroom_id, buyer_id);
CREATE INDEX idx_audit_dataroom_timestamp ON dataroom_audit(dataroom_id, timestamp);
CREATE INDEX idx_seller_subscription ON seller_profiles(dataroom_subscription_active);
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: MVP (Weeks 1-2)
- [ ] Database migrations
- [ ] Core services (CRUD)
- [ ] Vendor UI: Upload & manage documents
- [ ] Buyer UI: Request access + NDA signing
- [ ] Basic audit trail

### Phase 2: Access Control (Week 3)
- [ ] Buyer permission levels (view_only, download, admin)
- [ ] Vendor: Approve/reject requests
- [ ] Direct access grant
- [ ] NDA signature verification

### Phase 3: Enhancements (Later)
- [ ] PDF watermarking
- [ ] Q&A comments on documents
- [ ] Document versioning
- [ ] Advanced audit reports
- [ ] Email notifications (Sendgrid integration)

### Phase 4: Payment Integration (Later)
- [ ] Stripe subscription setup
- [ ] Webhook handling
- [ ] Renewal reminders
- [ ] Subscription lifecycle

---

## 📧 EMAIL NOTIFICATIONS

### Seller Emails
- "New access request from Buyer X"
- "Buyer X signed NDA"
- "Your Dataroom subscription expires in 7 days"
- "Your Dataroom subscription has expired"

### Buyer Emails
- "Seller X granted you Dataroom access"
- "Access request approved/rejected"
- "You are now ready to access the Dataroom"

---

## 🧪 TESTING CHECKLIST

### Unit Tests
- [ ] Document upload/delete
- [ ] Permission checks
- [ ] Subscription status
- [ ] NDA signature logic

### Integration Tests
- [ ] File storage flow
- [ ] Access approval workflow
- [ ] Audit trail recording
- [ ] Email notifications

### E2E Tests
- [ ] Vendor: Create → Upload → Share
- [ ] Buyer: Request → Sign NDA → Access
- [ ] Subscription renewal flow

---

## 📝 MIGRATION SCRIPT

Save as: `supabase_migration_dataroom.sql`

```sql
-- Run in Supabase SQL Editor
-- See database schema section above for full DDL

-- Grant permissions
GRANT ALL ON datarooms TO authenticated;
GRANT ALL ON dataroom_documents TO authenticated;
GRANT ALL ON dataroom_access TO authenticated;
GRANT ALL ON dataroom_audit TO authenticated;

-- Create indexes
CREATE INDEX idx_datarooms_seller_id ON datarooms(seller_id);
CREATE INDEX idx_documents_dataroom_id ON dataroom_documents(dataroom_id);
-- ... (see indexing section)
```

---

## 🔗 REFERENCES & RESOURCES

### Similar Products
- Box Dataroom
- Mergermarket Intralinks
- Firmex DealRoom

### Libraries (to consider)
- `react-pdf` - PDF viewer
- `jsPDF` - PDF generation/watermarking
- `pdfjs-dist` - PDF rendering
- `axios` - File uploads
- `date-fns` - Date formatting

### Stripe Documentation
- https://stripe.com/docs/billing/subscriptions
- https://stripe.com/docs/webhooks

---

## 📞 SUPPORT & MAINTENANCE

### Monitoring
- Daily: Check failed uploads
- Weekly: Review audit logs for suspicious activity
- Monthly: Check storage usage and costs

### Maintenance Tasks
- Archive old documents after 2+ years
- Clean up failed upload attempts
- Review subscription renewals
- Test disaster recovery

---

## ✅ DEPLOYMENT CHECKLIST

Before going live:
- [ ] All tests passing
- [ ] Error handling complete
- [ ] Logging in place
- [ ] Performance tested (search, pagination)
- [ ] Security audit completed
- [ ] GDPR compliance verified
- [ ] Documentation updated
- [ ] Stakeholder approval
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

---

**Last Updated:** 12/02/2026  
**Status:** Ready for Implementation Phase 1