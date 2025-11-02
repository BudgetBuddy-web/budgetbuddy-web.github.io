# 🎯 Render Configuration Guide - Step by Step

## 📋 Overview
This guide shows you **exactly** how to configure Render to auto-deploy your BudgetBuddy backend from GitHub.

---

## 🔑 Step 1: Login to Render

1. Go to: **https://dashboard.render.com**
2. Login with your account
3. You should see your existing service: **budget-buddy-h1k2**

---

## ⚙️ Step 2: Configure Your Existing Service

### Option A: Update Existing Service (Recommended - Keeps Your Data)

#### 2.1 Go to Your Service Settings

```
1. Click on your service: "budget-buddy-h1k2"
2. Click "Settings" in the left sidebar
```

#### 2.2 Update Build & Deploy Settings

Scroll to **"Build & Deploy"** section and set:

```yaml
Build Command:
cd server && npm install

Start Command:
cd server && npm start

Auto-Deploy:
Yes (toggle ON)

Branch:
main
```

**Screenshot locations**:
- Build Command: Under "Build & Deploy" section
- Start Command: Same section, below Build Command
- Auto-Deploy: Toggle switch at the top

#### 2.3 Verify Environment Variables

Click **"Environment"** in the left sidebar and verify these exist:

```env
NODE_ENV = production
PORT = 5000
MONGODB_URI = mongodb+srv://your-connection-string
JWT_SECRET = your-secret-key-here
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
EMAIL_USER = your-gmail@gmail.com
EMAIL_PASS = your-app-password
CLIENT_URL = https://budgetbuddy-web.github.io
```

**⚠️ Important**: Don't delete these! They're already configured.

#### 2.4 Save and Deploy

```
1. Scroll to bottom
2. Click "Save Changes"
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 2-3 minutes for deployment
```

---

### Option B: Create New Service from Blueprint (Fresh Start)

#### 2.1 Create New Blueprint

```
1. In Render Dashboard, click "New +" button (top right)
2. Select "Blueprint"
3. Click "Connect a repository"
```

#### 2.2 Connect Your GitHub Repository

```
1. Find: "budgetbuddy-web/budgetbuddy-web.github.io"
2. Click "Connect"
3. Render will scan for render.yaml file
4. You should see: "✅ Found render.yaml"
```

#### 2.3 Configure Blueprint

Render will auto-detect from `render.yaml`:

```yaml
✅ Service Name: budget-buddy-backend
✅ Runtime: Node
✅ Build Command: cd server && npm install
✅ Start Command: cd server && npm start
✅ Region: Singapore
✅ Plan: Free
```

#### 2.4 Add Environment Variables

Click "Add Environment Variable" for each:

```
Key: NODE_ENV          Value: production
Key: PORT              Value: 5000
Key: MONGODB_URI       Value: mongodb+srv://...
Key: JWT_SECRET        Value: your-secret-key
Key: GOOGLE_CLIENT_ID  Value: your-google-client-id
Key: GOOGLE_CLIENT_SECRET  Value: your-secret
Key: EMAIL_USER        Value: your-email@gmail.com
Key: EMAIL_PASS        Value: your-app-password
Key: CLIENT_URL        Value: https://budgetbuddy-web.github.io
```

#### 2.5 Deploy

```
1. Review all settings
2. Click "Apply"
3. Render will start deploying
4. Wait 3-5 minutes
```

---

## 🔍 Step 3: Verify Auto-Deploy is Working

### 3.1 Check Auto-Deploy Status

```
1. Go to your service dashboard
2. Look for "Auto-Deploy" section
3. Should show: "Auto-Deploy: Yes ✅"
4. Should show: "Branch: main"
```

### 3.2 Check GitHub Connection

```
1. In service settings
2. Scroll to "Repository" section
3. Should show: "budgetbuddy-web/budgetbuddy-web.github.io"
4. Should show: "Connected ✅"
```

### 3.3 Test Auto-Deploy

Make a small test change:

```bash
cd /home/david/HTML/BudgetBuddy
echo "// Test auto-deploy" >> server/server.js
git add server/server.js
git commit -m "Test: Verify auto-deploy"
git push origin main
```

Then watch in Render:
```
1. Go to your service dashboard
2. Click "Logs" tab
3. You should see: "Deploying commit: Test: Verify auto-deploy"
4. Wait for: "Deploy succeeded ✅"
```

---

## 📊 Step 4: Monitor Deployment

### 4.1 Check Deployment Logs

```
1. Go to service dashboard
2. Click "Logs" tab
3. You should see:
   ✅ Cloning repository...
   ✅ Running build command...
   ✅ npm install completed
   ✅ Starting service...
   ✅ Server running on port 5000
   ✅ MongoDB connected successfully
```

### 4.2 Check Service Status

```
1. Service Status: "Live ✅"
2. Last Deploy: "X minutes ago"
3. Deploy Type: "Auto-deploy from GitHub"
```

### 4.3 Test Your API

Click on your service URL or use curl:

```bash
# Test health endpoint
curl https://budget-buddy-h1k2.onrender.com/api/health

# Expected response:
{
  "status": "OK",
  "message": "BudgetBuddy API is running",
  "timestamp": "2025-11-02T..."
}
```

---

## 🎯 Step 5: Configure Webhooks (Auto-Configured)

Render automatically sets up GitHub webhooks. To verify:

### On GitHub:

```
1. Go to: https://github.com/budgetbuddy-web/budgetbuddy-web.github.io
2. Click "Settings" tab
3. Click "Webhooks" in left sidebar
4. You should see: "https://api.render.com/deploy/..."
5. Status should be: ✅ Active
```

### What the webhook does:

```
GitHub Push → Webhook triggers → Render detects → Auto-deploy starts
```

---

## 🔧 Step 6: Advanced Configuration (Optional)

### 6.1 Custom Domain (If needed)

```
1. In service settings
2. Click "Custom Domain"
3. Add your domain (e.g., api.budgetbuddy.com)
4. Follow DNS instructions
```

### 6.2 Health Check Path

```
1. In service settings
2. Find "Health Check Path"
3. Set to: /api/health
4. Render will ping this every 30 seconds
```

### 6.3 Instance Type

```
Current: Free (0.1 CPU, 512 MB RAM)

If you need more:
- Starter: $7/month (0.5 CPU, 512 MB RAM)
- Standard: $25/month (1 CPU, 2 GB RAM)
```

---

## ✅ Configuration Checklist

After following these steps, verify:

- [ ] Service is running (Status: Live)
- [ ] Auto-Deploy is enabled (Toggle: Yes)
- [ ] Build command set: `cd server && npm install`
- [ ] Start command set: `cd server && npm start`
- [ ] All environment variables configured
- [ ] GitHub repository connected
- [ ] Webhook active on GitHub
- [ ] Latest code deployed
- [ ] Health check responding
- [ ] No errors in logs

---

## 🐛 Common Issues & Solutions

### Issue 1: "Build Failed"

**Error**: `Cannot find module`

**Solution**:
```bash
# Update package.json
cd /home/david/HTML/BudgetBuddy/server
npm install
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push origin main
```

### Issue 2: "Service Keeps Restarting"

**Error**: `Error: Cannot connect to MongoDB`

**Solution**:
1. Check MONGODB_URI in environment variables
2. Verify MongoDB Atlas allows Render IPs
3. Whitelist IP: `0.0.0.0/0` in MongoDB Network Access

### Issue 3: "Auto-Deploy Not Working"

**Error**: Push to GitHub but no deployment

**Solution**:
1. Check webhook status on GitHub
2. Re-enable auto-deploy in Render settings
3. Manually trigger one deploy

### Issue 4: "Environment Variable Not Found"

**Error**: `JWT_SECRET is not defined`

**Solution**:
1. Go to service → Environment
2. Add missing variable
3. Click "Save"
4. Manually deploy once

---

## 📱 Step 7: Mobile Access to Render Dashboard

### Render Mobile App:
```
❌ No official mobile app
✅ Use web browser on mobile
✅ Dashboard is mobile-responsive
```

### Quick Mobile Actions:
```
1. Open: dashboard.render.com
2. Login
3. View logs
4. Trigger manual deploy
5. Check service status
```

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| Render Dashboard | https://dashboard.render.com |
| Your Service | https://dashboard.render.com/web/[your-service-id] |
| Your API | https://budget-buddy-h1k2.onrender.com |
| API Health Check | https://budget-buddy-h1k2.onrender.com/api/health |
| Render Docs | https://render.com/docs |
| GitHub Repo | https://github.com/budgetbuddy-web/budgetbuddy-web.github.io |

---

## 📊 What Happens When You Push Code

```
┌─────────────────────────────────────────────┐
│  1. You: git push origin main               │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  2. GitHub: Receives your code              │
│     - Updates main branch                   │
│     - Triggers webhook                      │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  3. Render: Receives webhook                │
│     - Detects new commit                    │
│     - Reads render.yaml                     │
│     - Starts deployment                     │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  4. Build Phase                             │
│     - Clone repository                      │
│     - cd server                             │
│     - npm install                           │
│     - Download dependencies                 │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  5. Deploy Phase                            │
│     - Stop old instance                     │
│     - npm start                             │
│     - Connect to MongoDB                    │
│     - Listen on port 5000                   │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  6. Health Check                            │
│     - Ping /api/health                      │
│     - Wait for 200 OK                       │
│     - Mark as "Live"                        │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  7. Complete! ✅                             │
│     Your API is now live with latest code   │
└─────────────────────────────────────────────┘

Total Time: 2-3 minutes
```

---

## 🎯 Quick Reference Commands

### Deploy Backend:
```bash
git add server/
git commit -m "Update backend"
git push origin main
# Render auto-deploys in 2-3 minutes
```

### Check Deployment Status:
```bash
# Test API is running
curl https://budget-buddy-h1k2.onrender.com/api/health
```

### Force Redeploy:
```bash
# In Render Dashboard
# Click "Manual Deploy" → "Clear build cache & deploy"
```

---

## ✅ Final Verification

Run these tests to confirm everything works:

### Test 1: Health Check
```bash
curl https://budget-buddy-h1k2.onrender.com/api/health
# Should return: {"status": "OK", ...}
```

### Test 2: Auto-Deploy
```bash
# Make a change
echo "// Test" >> server/server.js
git add server/server.js
git commit -m "Test auto-deploy"
git push origin main

# Check Render logs - should show deployment in progress
```

### Test 3: New Endpoints
```bash
# Test admin request endpoint (should NOT be 404)
curl -X POST https://budget-buddy-h1k2.onrender.com/api/user/request-admin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 Need Help?

### Render Support:
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### Your Configuration Files:
- Backend config: `render.yaml`
- Frontend config: `.github/workflows/deploy.yml`
- Setup guide: `RENDER_AUTO_DEPLOY_SETUP.md`

---

## 🎉 You're Done!

After following this guide:
- ✅ Push to GitHub = Auto-deploy to Render
- ✅ No manual steps needed
- ✅ Latest code always live in 2-3 minutes
- ✅ Full automation configured

**Next**: Just push your code and Render handles the rest! 🚀
