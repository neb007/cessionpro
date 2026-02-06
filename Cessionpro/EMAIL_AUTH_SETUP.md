# Email Authentication Setup Guide - CessionPro

## 📋 Overview

This guide explains how to set up and use the email authentication system integrated with Supabase. The system includes:

- **Email Registration** - Create accounts with email & password
- **Email Login** - Sign in with email credentials  
- **Password Reset** - Recover forgotten passwords via email
- **Email Verification** - Confirm email ownership before account activation
- **Bilingual Support** - Full French and English translations

---

## 🚀 Setup Instructions

### Step 1: Configure Supabase Email Settings

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication → Providers**
4. Go to the **Email** section
5. Enable **Email/Password authentication**
6. Configure the following settings:

   **Sender Configuration:**
   - Sender name: `CessionPro`
   - Sender email: `noreply@cessionpro.com`

   **Email Templates:**
   - Confirm signup: Enable
   - Confirm email change: Enable
   - Reset password: Enable

### Step 2: Set Email Redirect URLs

In **Authentication → URL Configuration**:

1. Add your redirect URLs:
   ```
   https://yourdomain.com/auth-callback
   https://yourdomain.com/reset-password
   http://localhost:5173/auth-callback (for development)
   http://localhost:5173/reset-password (for development)
   ```

2. Also add this to **Auth Hooks → Email Templates → SMTP Credentials** if using custom SMTP

### Step 3: Verify Environment Variables

Ensure your `.env.local` has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Update Authentication Email Templates (Optional)

Supabase provides default email templates. To customize them:

1. Go to **Authentication → Email Templates**
2. Click on each template to customize:

   **Confirm Signup Email**
   ```
   Subject: Welcome to CessionPro
   
   Hello {{ .Email }},
   
   Click the link below to confirm your email address:
   {{ .ConfirmationURL }}
   
   Best regards,
   The CessionPro Team
   ```

   **Reset Password Email**
   ```
   Subject: Reset Your CessionPro Password
   
   Hello {{ .Email }},
   
   Click the link below to reset your password:
   {{ .ConfirmationURL }}
   
   If you didn't request this, ignore this email.
   
   Best regards,
   The CessionPro Team
   ```

---

## 📱 Available Pages

### Login Page (`/login`)
- Email and password authentication
- "Remember me" functionality
- Link to registration page
- Password recovery link
- Email validation on input
- Error handling with clear messages

**Features:**
```javascript
// Accessible via
navigate('/login');
// or
<Link to="/login">Sign In</Link>
```

### Register Page (`/register`)
- Email registration with password
- Password strength indicator (5 levels)
- Confirm password field
- Terms and conditions acceptance
- Email validation
- Success message with auto-redirect

**Features:**
```javascript
// Accessible via
navigate('/register');
// or
<Link to="/register">Create Account</Link>
```

### Password Reset Page (`/password-reset`)
- Two-step password recovery flow
- Email request form
- Password update form (when clicking email link)
- Email validation
- Clear status messages

**Features:**
```javascript
// Request page
navigate('/password-reset');

// Reset page (auto-loaded with token)
navigate('/password-reset?token=...');
```

### Auth Callback Page (`/auth-callback`)
- Handles email verification after signup
- Displays verification status
- Auto-redirects on success
- Shows error messages on failure

---

## 🔐 Authentication Context (`useAuth` Hook)

The `AuthContext` provides these methods:

### Login
```javascript
const { login } = useAuth();

await login(email, password);
// Returns: { user, session }
// Throws: Error with message
```

### Register
```javascript
const { register } = useAuth();

await register(email, password);
// Sends confirmation email
// Returns: { user, session }
```

### Password Reset
```javascript
const { resetPassword } = useAuth();

await resetPassword(email);
// Sends reset email
// Returns: { success: true }
```

### Update Password
```javascript
const { updatePassword } = useAuth();

await updatePassword(newPassword);
// Updates user password
// Returns: { success: true }
```

### Logout
```javascript
const { logout } = useAuth();

await logout();
// Clears session and redirects to home
```

### Error Handling
```javascript
const { authError, clearAuthError } = useAuth();

// authError structure:
{
  type: 'login_error' | 'registration_error' | 'reset_error',
  message: 'Error description'
}

// Clear error
clearAuthError();
```

---

## 💻 Usage Examples

### Complete Login Flow
```javascript
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

function LoginExample() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // User is logged in, AuthContext handles redirect
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Password Reset Flow
```javascript
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

function ResetPasswordExample() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setIsSent(true);
      // User will receive email with reset link
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Email</button>
      {isSent && <p>Check your email for reset instructions</p>}
    </form>
  );
}
```

### Protected Component Example
```javascript
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedComponent() {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Protected Content</div>;
}
```

---

## 🧪 Testing Authentication

### Test Email Registration
1. Visit `/register`
2. Enter test email (e.g., `test@example.com`)
3. Enter password (min. 6 characters)
4. Confirm password
5. Accept terms
6. Click "Create my account"
7. Check email for confirmation link
8. Click confirmation link to verify email
9. Redirected to Dashboard (if authenticated)

### Test Email Login
1. Visit `/login`
2. Enter registered email
3. Enter password
4. Click "Sign in"
5. Dashboard loads if credentials correct
6. Error message if invalid

### Test Password Reset
1. Visit `/password-reset`
2. Enter registered email
3. Check email for reset link
4. Click reset link (auto goes to reset page)
5. Enter new password
6. Confirm new password
7. Click "Reset password"
8. Success message and redirect to login
9. Login with new password

### Test Remember Me
1. Visit `/login`
2. Check "Remember me" checkbox
3. Enter credentials and login
4. Logout
5. Visit `/login` again
6. Email should be pre-filled

---

## 📧 Email Customization

### Using Supabase Email Templates

Supabase sends emails automatically. The links include tokens that are:

**Confirmation Email Link Format:**
```
https://yourdomain.com/auth-callback?code=YOUR_CODE&type=signup
```

**Password Reset Email Link Format:**
```
https://yourdomain.com/reset-password?code=YOUR_CODE&type=recovery
```

Supabase automatically handles the code exchange for a session.

### Custom SMTP (Advanced)

For production, use custom SMTP:

1. Go to **Authentication → SMTP Settings**
2. Configure your email provider:
   - SMTP Host
   - SMTP Port
   - SMTP User
   - SMTP Password
3. Set sender email and name

Popular providers:
- SendGrid
- AWS SES
- Mailgun
- Gmail (not recommended for production)

---

## 🛡️ Security Notes

✅ **What's Protected:**
- Passwords are hashed with bcrypt
- Sessions are secure and httpOnly
- Email verification required for account activation
- Password reset requires email confirmation
- CSRF protection on all forms

### Security Best Practices:

1. **Always require email verification**
   - Supabase sends confirmation email by default
   - Users cannot login until email is verified

2. **Use strong password requirements**
   - Minimum 6 characters (configurable in AuthContext)
   - Password strength indicator shown during signup

3. **Rate limiting**
   - Supabase includes rate limiting on auth endpoints
   - Prevents brute force attacks

4. **HTTPS only in production**
   - Always use HTTPS for production
   - Set secure flags on cookies

5. **Monitor auth logs**
   - Check Supabase Analytics for suspicious activity
   - Monitor failed login attempts

---

## ⚠️ Troubleshooting

### "Email not verified" error
- User needs to click confirmation link in email
- Check spam folder for email
- Ensure email templates are configured

### "Invalid credentials" on login
- Check email and password are correct
- Verify email is confirmed
- Email should be case-insensitive but try exact case

### Password reset email not received
- Check email address is registered
- Check spam folder
- Verify SMTP settings are correct
- Check Supabase email logs

### Redirect loops after login
- Check that user is authenticated in AuthContext
- Verify Layout component doesn't force redirect
- Check route configuration in pages.config.js

### "Redirect URL mismatch" error
- Ensure redirect URLs in Supabase match your app URLs
- Include both http (dev) and https (prod)
- Check URL configuration in Supabase dashboard

---

## 📚 API Reference

### AuthContext Provider
```javascript
<AuthProvider>
  {children}
</AuthProvider>
```

### useAuth Hook
```javascript
const {
  user,                    // Current user object or null
  isAuthenticated,         // Boolean
  isLoadingAuth,          // Boolean - loading state
  authError,              // { type, message } or null
  appPublicSettings,      // App settings
  login,                  // (email, password) => Promise
  register,               // (email, password) => Promise
  resetPassword,          // (email) => Promise
  updatePassword,         // (newPassword) => Promise
  logout,                 // (shouldRedirect?) => Promise
  navigateToLogin,        // () => void
  checkAppState,          // () => Promise
  clearAuthError,         // () => void
} = useAuth();
```

---

## ✅ Checklist for Production

- [ ] Configure Supabase email provider
- [ ] Set redirect URLs in Supabase
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test password reset flow
- [ ] Customize email templates
- [ ] Set up custom SMTP (optional)
- [ ] Test with real email addresses
- [ ] Enable email verification
- [ ] Monitor auth logs
- [ ] Plan for user support emails
- [ ] Document authentication flow for users
- [ ] Test on production URL

---

## 🆘 Support

For issues related to:
- **Supabase Auth**: [Supabase Docs](https://supabase.com/docs/guides/auth)
- **Email Sending**: [Supabase Email](https://supabase.com/docs/guides/auth/auth-smtp)
- **Custom SMTP**: [Email Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

---

## 📝 Notes

- All pages are bilingual (French/English)
- Responsive design works on mobile and desktop
- Dark theme for auth pages matches CessionPro branding
- Form validation happens client-side and server-side
- Error messages are user-friendly and actionable

