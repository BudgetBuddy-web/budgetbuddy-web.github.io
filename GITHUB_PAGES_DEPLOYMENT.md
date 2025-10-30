# GitHub Pages Deployment Guide

## 🌐 Deploying BudgetBuddy to GitHub Pages

### ⚠️ Important Note

GitHub Pages can only host **static frontend** (React app). The backend (Node.js + MongoDB) needs separate hosting.

---

## 📋 Deployment Options

### Option 1: Frontend on GitHub Pages + Backend Elsewhere ✅ RECOMMENDED

**Frontend:** GitHub Pages (Free)
**Backend:** Render/Railway/Heroku (Free tier available)
**Database:** MongoDB Atlas (Free tier)

### Option 2: Full Stack on Single Platform

**Both:** Vercel/Netlify/Railway (All-in-one deployment)

---

## 🚀 Option 1: Deploy Frontend to GitHub Pages

### Step 1: Update Client Configuration

1. **Edit `client/package.json`** - Add homepage:

```bash
cd /home/david/HTML/BudgetBuddy/client
nano package.json
```

Add this line at the top level (after "name"):
```json
{
  "name": "budgetbuddy-client",
  "homepage": "https://davidnaruto11.github.io/Budget-Buddy",
  ...
}
```

2. **Install gh-pages package:**

```bash
cd /home/david/HTML/BudgetBuddy/client
npm install --save-dev gh-pages
```

3. **Add deploy scripts to `client/package.json`:**

Add these to the `"scripts"` section:
```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```

### Step 2: Deploy Backend First

You need to deploy the backend API before deploying the frontend.

**Recommended: Railway.app (Free)**

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `Budget-Buddy` repository
5. Select `server` folder as root
6. Add environment variables:
   - `MONGODB_URI` (from MongoDB Atlas)
   - `JWT_SECRET`
   - `PORT=5000`
   - `CLIENT_URL=https://davidnaruto11.github.io/Budget-Buddy`
7. Deploy!
8. **Copy the deployment URL** (e.g., `https://budgetbuddy-production.up.railway.app`)

**Alternative: Render.com (Free)**

1. Go to https://render.com
2. Sign in with GitHub
3. New → Web Service
4. Connect `Budget-Buddy` repo
5. Root directory: `server`
6. Build command: `npm install`
7. Start command: `npm start`
8. Add environment variables (same as above)
9. Deploy!

**Alternative: Heroku (Paid)**

Heroku no longer has a free tier but is still popular.

### Step 3: Update Frontend API URL

1. **Create `client/.env.production`:**

```bash
cd /home/david/HTML/BudgetBuddy/client
nano .env.production
```

Add:
```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
# Replace with your actual backend URL from Step 2
```

### Step 4: Deploy to GitHub Pages

```bash
cd /home/david/HTML/BudgetBuddy/client
npm run deploy
```

This will:
1. Build your React app
2. Create a `gh-pages` branch
3. Push the build to GitHub Pages
4. Your site will be live at: https://davidnaruto11.github.io/Budget-Buddy

### Step 5: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/davidnaruto11/Budget-Buddy
2. Click **Settings** → **Pages**
3. Under "Source", select: **Deploy from a branch**
4. Branch: **gh-pages** → folder: **/ (root)**
5. Click **Save**
6. Wait 2-5 minutes for deployment

Your app will be live at: **https://davidnaruto11.github.io/Budget-Buddy** 🎉

---

## 🗄️ Database Setup (MongoDB Atlas)

### Free MongoDB Cloud Database

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Create account** (free)
3. **Create cluster:**
   - Choose FREE tier (M0)
   - Select region closest to you
   - Cluster name: `BudgetBuddy`
4. **Create database user:**
   - Username: `budgetbuddy`
   - Password: (generate strong password)
   - **Save credentials!**
5. **Whitelist IP:**
   - Network Access → Add IP Address
   - Click "Allow access from anywhere" (0.0.0.0/0)
   - For production, use specific IPs
6. **Get connection string:**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://budgetbuddy:yourpassword@cluster0.xxxxx.mongodb.net/budgetbuddy?retryWrites=true&w=majority`

7. **Use this as `MONGODB_URI` in backend deployment**

---

## 🔒 Environment Variables Summary

### Backend (Railway/Render)

```env
MONGODB_URI=mongodb+srv://budgetbuddy:password@cluster0.xxxxx.mongodb.net/budgetbuddy
JWT_SECRET=your_super_secret_key_min_32_characters_long
PORT=5000
CLIENT_URL=https://davidnaruto11.github.io/Budget-Buddy
NODE_ENV=production
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

---

## ✅ Quick Deployment Checklist

- [ ] Create MongoDB Atlas account and cluster
- [ ] Deploy backend to Railway/Render
- [ ] Add environment variables to backend
- [ ] Get backend deployment URL
- [ ] Add `homepage` to client/package.json
- [ ] Install gh-pages: `npm install --save-dev gh-pages`
- [ ] Add deploy scripts to client/package.json
- [ ] Create client/.env.production with API URL
- [ ] Run `npm run deploy` in client folder
- [ ] Enable GitHub Pages in repository settings
- [ ] Wait for deployment (2-5 minutes)
- [ ] Test your live app!

---

## 🎯 Alternative: Full Stack Deployment (Easier)

### Deploy Everything on Vercel (Recommended for Beginners)

**Pros:**
- Deploys both frontend and backend
- Free tier available
- Easy setup
- Automatic HTTPS
- Great performance

**Steps:**

1. **Go to:** https://vercel.com
2. **Sign in with GitHub**
3. **Import project:** Budget-Buddy
4. **Configure:**
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Add Serverless Functions** (for backend):
   - Create `api` folder in root
   - Move backend code to serverless functions
6. **Add environment variables**
7. **Deploy!**

### Deploy on Netlify

Similar to Vercel:
1. https://netlify.com
2. Sign in with GitHub
3. Import Budget-Buddy
4. Configure build settings
5. Add Netlify Functions for backend
6. Deploy!

---

## 🧪 Testing Your Deployed App

After deployment:

1. **Visit your URL:** https://davidnaruto11.github.io/Budget-Buddy
2. **Check console** (F12) for errors
3. **Test login/register**
4. **Add transactions**
5. **Click Akari** (she should respond!)
6. **Test on mobile**

### Common Issues

**CORS Errors:**
- Make sure backend `CLIENT_URL` includes your GitHub Pages URL
- Check CORS settings in `server/server.js`

**API Not Found:**
- Verify `REACT_APP_API_URL` in `.env.production`
- Check backend is running
- Test API directly: `https://your-backend-url.railway.app/api/health`

**Assets Not Loading:**
- Clear browser cache
- Check `homepage` in package.json
- Rebuild: `npm run deploy`

---

## 📱 Custom Domain (Optional)

Want a custom URL like `budgetbuddy.com`?

1. **Buy domain** (Namecheap, Google Domains, etc.)
2. **In GitHub Pages settings:**
   - Add custom domain
3. **In domain registrar:**
   - Add CNAME record pointing to: `davidnaruto11.github.io`
4. **Wait for DNS** (up to 24 hours)

---

## 🔄 Updating Your Deployed App

Whenever you make changes:

```bash
# 1. Commit changes
cd /home/david/HTML/BudgetBuddy
git add .
git commit -m "Update: describe your changes"
git push origin main

# 2. Redeploy frontend
cd client
npm run deploy

# 3. If backend changed, redeploy on Railway/Render
# (Usually auto-deploys on git push)
```

---

## 📊 Monitoring

After deployment:

- **GitHub Pages Status:** Settings → Pages
- **Railway Dashboard:** https://railway.app/dashboard
- **MongoDB Metrics:** Atlas Dashboard
- **Analytics:** Add Google Analytics (optional)

---

## 💰 Cost Summary

| Service | Free Tier | Paid |
|---------|-----------|------|
| GitHub Pages | ✅ Free forever | N/A |
| Railway.app | ✅ $5/month credit | $0.000463/GB-hr |
| Render.com | ✅ 750 hours/month | $7/month |
| MongoDB Atlas | ✅ 512MB storage | $9+/month |
| Vercel | ✅ Unlimited | $20/month |
| Netlify | ✅ 100GB bandwidth | $19/month |

**Recommended Free Setup:**
- Frontend: GitHub Pages (Free)
- Backend: Railway (Free $5 credit)
- Database: MongoDB Atlas (Free tier)
- **Total: $0/month** ✅

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- GitHub Pages: https://docs.github.com/en/pages

**Good luck with your deployment! 🚀**
