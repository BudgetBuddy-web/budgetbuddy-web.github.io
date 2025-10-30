# 🚀 Backend Deployment Guide

## Overview
Deploy your BudgetBuddy backend to Render.com (free tier) and MongoDB Atlas (free tier).

---

## Part 1: Setup MongoDB Atlas (Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google or Email
3. Answer the welcome questions (any answers work)
4. Choose **FREE** tier (M0 Sandbox)
5. Select a cloud provider (AWS recommended) and region (closest to you)
6. Click **Create Cluster** (takes 1-3 minutes)

### Step 2: Create Database User
1. Click **Database Access** in left sidebar
2. Click **+ ADD NEW DATABASE USER**
3. Choose **Password** authentication
4. Username: `budgetbuddy-user`
5. Click **Autogenerate Secure Password** (COPY THIS PASSWORD!)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 3: Allow Network Access
1. Click **Network Access** in left sidebar
2. Click **+ ADD IP ADDRESS**
3. Click **ALLOW ACCESS FROM ANYWHERE** (for simplicity)
4. Confirm: `0.0.0.0/0` (allows all IPs)
5. Click **Confirm**

### Step 4: Get Connection String
1. Click **Database** in left sidebar
2. Click **Connect** button on your cluster
3. Select **Connect your application**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://budgetbuddy-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you copied earlier
7. Add database name before `?`: 
   ```
   mongodb+srv://budgetbuddy-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/budgetbuddy?retryWrites=true&w=majority
   ```
8. **SAVE THIS CONNECTION STRING** - you'll need it!

---

## Part 2: Deploy Backend to Render.com

### Step 1: Sign Up for Render
1. Go to: **https://render.com**
2. Click **Get Started** or **Sign Up**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your GitHub

### Step 2: Create Web Service
1. Click **+ New** button (top right)
2. Select **Web Service**
3. Click **Connect account** if needed
4. Find and select your **Budget-Buddy** repository
5. Click **Connect**

### Step 3: Configure Web Service
Fill in these settings:

- **Name**: `budgetbuddy-backend` (or any name you like)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server` (IMPORTANT!)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Step 4: Add Environment Variables
Click **Advanced** button and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | (Paste your MongoDB connection string from Part 1) |
| `JWT_SECRET` | (Generate a random string, e.g., `your-super-secret-jwt-key-12345`) |
| `CLIENT_URL` | `https://davidnaruto11.github.io/Budget-Buddy` |

To generate a strong JWT_SECRET, you can use:
```bash
openssl rand -base64 32
```

### Step 5: Deploy
1. Click **Create Web Service**
2. Wait 3-5 minutes for deployment
3. You'll see build logs - wait for "Deploy live" message
4. Your backend URL will be: `https://budgetbuddy-backend.onrender.com`
5. Test it: Visit `https://budgetbuddy-backend.onrender.com/api/health`
   - You should see: `{"status":"OK","message":"BudgetBuddy API is running",...}`

---

## Part 3: Update Frontend API URL

### Step 1: Update API Configuration
Your backend URL will be something like:
```
https://budgetbuddy-backend.onrender.com
```

We need to update the frontend to use this instead of localhost.

### Step 2: Create Production Environment File
In `/client` folder, create `.env.production`:
```env
REACT_APP_API_URL=https://budgetbuddy-backend.onrender.com
```

### Step 3: Update API Service
Modify `/client/src/services/api.js` to use environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### Step 4: Rebuild and Deploy Frontend
```bash
cd /home/david/HTML/BudgetBuddy
git add .
git commit -m "Update API URL for production"
git push origin main
cd client
npm run deploy
```

---

## Part 4: Testing

### Test Backend
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should return JSON with status "OK"

### Test Frontend
1. Visit: `https://davidnaruto11.github.io/Budget-Buddy`
2. Try to **Register** a new account
3. Try to **Login**
4. Should work now! 🎉

---

## Troubleshooting

### "Registration failed" or "Login failed"
- Check if backend is running: Visit `/api/health` endpoint
- Check browser console (F12) for errors
- Check Render logs for backend errors

### Backend shows "MongoDB connection error"
- Verify MongoDB connection string is correct
- Check password has no special characters (or URL-encode them)
- Ensure Network Access allows `0.0.0.0/0`

### CORS errors
- Verify `CLIENT_URL` environment variable is set correctly
- Should be: `https://davidnaruto11.github.io/Budget-Buddy`

---

## Free Tier Limitations

### Render.com Free Tier
- ✅ Free forever
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30 seconds
- ✅ 750 hours/month (enough for 24/7 for 1 app)

### MongoDB Atlas Free Tier (M0)
- ✅ Free forever
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Perfect for learning/small projects

---

## Next Steps

Once everything works:
1. ✅ Your app is fully deployed and accessible online!
2. 🎉 Share the link with friends: `https://davidnaruto11.github.io/Budget-Buddy`
3. 📱 Works on mobile too!

---

## Need Help?
If you run into issues, check:
1. Render logs (in Render dashboard → Logs tab)
2. Browser console (F12 → Console tab)
3. Network tab (F12 → Network tab) to see API requests

Good luck! 🚀
