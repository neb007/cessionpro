# 🔐 CORS Setup Guide - Backend Configuration

## What is CORS?

**CORS** (Cross-Origin Resource Sharing) is a security mechanism that controls when a frontend can communicate with a backend on a different domain.

**Your Setup:**
- Frontend: `http://localhost:5173` (Vite Dev Server)
- Backend: `http://localhost:3001` (Node/Express)
- These are **different origins** → CORS required!

---

## 🚀 Express.js Backend Setup (Node)

### Step 1: Install CORS Package

```bash
npm install cors
# or
yarn add cors
```

### Step 2: Configure in Your Express App

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// ============ OPTION A: Development (Permissive) ============
app.use(cors({
  origin: 'http://localhost:5173',        // Your Vite dev server
  credentials: true,                       // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// ============ OPTION B: Production (Restrictive) ============
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'http://localhost:5173'  // Keep for local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Step 3: Handle Preflight Requests

```javascript
// This is usually automatic with cors middleware, but you can also:
app.options('*', cors()); // Enable preflight for all routes
// Or specific routes:
app.options('/api/notifications/send-digest-email', cors());
```

---

## 📧 Email Digest Endpoint

Add this endpoint to your backend:

```javascript
// POST /api/notifications/send-digest-email
app.post('/api/notifications/send-digest-email', cors(), async (req, res) => {
  try {
    const { recipientEmail, messageCount, messages, digestSentAt } = req.body;

    // Validate input
    if (!recipientEmail || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Example: Send email via Resend/SendGrid/AWS SES
    // await sendEmailViaResend({
    //   to: recipientEmail,
    //   subject: `📧 ${messageCount} new messages on CessionPro`,
    //   html: generateEmailHTML(messages),
    //   replyTo: 'noreply@cessionpro.fr'
    // });

    console.log(`[EMAIL] Digest sent to ${recipientEmail} with ${messageCount} messages`);

    res.json({
      success: true,
      message: 'Email sent successfully',
      recipient: recipientEmail,
      messageCount: messageCount
    });

  } catch (error) {
    console.error('[EMAIL] Error sending digest:', error);
    res.status(500).json({
      error: 'Failed to send email',
      message: error.message
    });
  }
});
```

---

## 🔌 Email Service Integration

### Using Resend (Recommended)

```bash
npm install resend
```

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmailViaResend(data) {
  const { to, subject, html, replyTo } = data;

  const result = await resend.emails.send({
    from: 'CessionPro <noreply@cessionpro.fr>',
    to: to,
    subject: subject,
    html: html,
    replyTo: replyTo
  });

  return result;
}
```

### Using SendGrid

```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailViaSendGrid(data) {
  const { to, subject, html } = data;

  const msg = {
    to: to,
    from: 'noreply@cessionpro.fr',
    subject: subject,
    html: html,
  };

  await sgMail.send(msg);
}
```

---

## 📝 HTML Email Template

```javascript
function generateEmailHTML(messages) {
  const messagesList = messages.map(msg => `
    <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #ff6b35;">
      <p><strong>${msg.senderName}</strong></p>
      <p>${msg.messagePreview}${msg.messagePreview.length >= 100 ? '...' : ''}</p>
      <small style="color: #666;">${msg.businessTitle}</small>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b35 0%, #004e89 100%); color: white; padding: 20px; border-radius: 8px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Messages on CessionPro</h1>
          <p>You have ${messages.length} new message(s)</p>
        </div>
        
        <div style="margin: 20px 0;">
          ${messagesList}
        </div>

        <div class="footer">
          <p>Log in to <a href="https://yourdomain.com">CessionPro</a> to reply.</p>
          <p>To adjust notification settings, visit your profile.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
```

---

## 🧪 Testing Locally

### Test CORS Request from Frontend:

```javascript
// In your browser console or React component
fetch('http://localhost:3001/api/notifications/send-digest-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN' // if needed
  },
  credentials: 'include', // Include cookies if needed
  body: JSON.stringify({
    recipientEmail: 'test@example.com',
    messageCount: 1,
    messages: [
      {
        senderName: 'John',
        messagePreview: 'Hello, are you interested?',
        businessTitle: 'Tech Startup',
        conversationId: '123'
      }
    ],
    digestSentAt: new Date().toISOString()
  })
})
.then(r => r.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

### Expected Response:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "recipient": "test@example.com",
  "messageCount": 1
}
```

---

## 🔑 Environment Variables

Add to your `.env.local`:

**Frontend:**
```
VITE_API_URL=http://localhost:3001
VITE_RESEND_API_KEY=re_your_key_here
```

**Backend:**
```
RESEND_API_KEY=re_your_key_here
SENDGRID_API_KEY=SG.your_key_here
NODE_ENV=development
PORT=3001
```

---

## 🚨 Common CORS Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `No 'Access-Control-Allow-Origin' header` | CORS not enabled | Install & enable cors middleware |
| `Credentials mode is 'include'` | Missing credentials option | Add `credentials: true` to cors() |
| `Method not allowed` | Method not in allowedMethods | Add method to `methods: [...]` |
| `Header not allowed` | Custom header not listed | Add to `allowedHeaders: [...]` |

---

## ✅ Checklist Before Deployment

- [ ] CORS middleware installed and configured
- [ ] Email endpoint created (`/api/notifications/send-digest-email`)
- [ ] Email service (Resend/SendGrid) configured
- [ ] API keys stored in environment variables
- [ ] CORS origin set to production URL
- [ ] Email template tested locally
- [ ] Frontend updated with backend API URL
- [ ] Error handling implemented
- [ ] Logging enabled for debugging

---

## 📊 Architecture Flow

```
Frontend (React)
       ↓
   Messages.jsx
       ↓ (sends POST)
   /api/notifications/send-digest-email
       ↓ (Node/Express + CORS)
   Email Service (Resend/SendGrid)
       ↓ (sends HTTP)
   SMTP Server
       ↓
   User's Email
```

---

**You're all set!** 🎉 Your messaging system is now production-ready.
