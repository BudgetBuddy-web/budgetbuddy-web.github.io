# Gmail Email Setup - Step by Step Guide

## ✅ What I've Done (Backend Code is Ready!)

I've already set up all the backend code for you:
- ✅ Installed `nodemailer` package
- ✅ Created email service (`server/utils/emailService.js`)
- ✅ Updated User model with reset token fields
- ✅ Added forgot/reset password endpoints
- ✅ Updated frontend to call real API
- ✅ Beautiful email templates with your branding

## 🔧 What YOU Need to Do (3 Simple Steps!)

### Step 1: Get Gmail App Password (5 minutes)

1. **Go to your Google Account:** https://myaccount.google.com/
2. Click **"Security"** (left sidebar)
3. **Enable 2-Step Verification:**
   - Scroll to "How you sign in to Google"
   - Click "2-Step Verification"
   - Follow the prompts to enable it (use your phone number)
4. **Create App Password:**
   - Go back to Security page
   - Under "How you sign in to Google", click **"App passwords"**
   - Select app: **"Mail"**
   - Select device: **"Other"** (type "BudgetBuddy")
   - Click **"Generate"**
   - **COPY THE 16-CHARACTER PASSWORD** (looks like: `abcd efgh ijkl mnop`)
   - Save it somewhere safe!

### Step 2: Add Environment Variables to Render.com (2 minutes)

1. **Go to Render Dashboard:** https://dashboard.render.com/
2. Click on your **`budget-buddy`** service
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"** and add these TWO new variables:

   **Variable 1:**
   - Key: `EMAIL_USER`
   - Value: `your-email@gmail.com` (your actual Gmail address)

   **Variable 2:**
   - Key: `EMAIL_PASSWORD`
   - Value: `abcd efgh ijkl mnop` (the 16-char app password you copied)

5. Click **"Save Changes"**
6. Render will automatically redeploy (wait 2-3 minutes)

### Step 3: Deploy Updated Code (1 minute)

Run these commands in your terminal:

```bash
cd /home/david/HTML/BudgetBuddy
git add .
git commit -m "Add real email functionality with Gmail"
git push
```

Render will auto-deploy the new code!

---

## 🎉 That's It! Test It Out:

1. Go to: https://budgetbuddy-web.github.io/forgot-password
2. Enter your email
3. Check your inbox for a beautiful password reset email! 📧

---

## 🔍 Troubleshooting

### "Invalid credentials" error?
- Make sure you're using the **App Password**, not your regular Gmail password
- App Password should be 16 characters with spaces removed
- Make sure 2-Step Verification is enabled

### Email not arriving?
- Check spam folder
- Wait 1-2 minutes (emails aren't instant)
- Check Render logs: Dashboard → your service → "Logs" tab
- Look for "✅ Password reset email sent" message

### "Less secure app access" error?
- You don't need this anymore! App Passwords work without it
- Make sure you enabled 2-Step Verification first

---

## 📧 What Emails Will Be Sent:

### 1. Welcome Email (when user registers)
- Beautiful branded email
- Links to dashboard
- Auto-sent on registration

### 2. Password Reset Email (when user forgets password)
- Secure reset link
- Expires in 1 hour
- Beautiful template

---

## 🔒 Security Features:

- ✅ Reset tokens are hashed (secure)
- ✅ Tokens expire in 1 hour
- ✅ One-time use (deleted after reset)
- ✅ Gmail App Password (not actual password)

---

## Created by: DAVID OLIVER J | URK23CS1305
## Date: October 31, 2025
