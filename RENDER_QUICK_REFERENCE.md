# ⚡ Render Configuration - Quick Reference

## 🎯 **3-Minute Setup**

### **Step 1: Go to Settings**
```
1. Login: https://dashboard.render.com
2. Click: "budget-buddy-h1k2"
3. Click: "Settings" tab
```

### **Step 2: Set These 3 Things**
```yaml
Auto-Deploy:      ● Yes
Build Command:    cd server && npm install
Start Command:    cd server && npm start
```

### **Step 3: Deploy Once**
```
1. Click: "Manual Deploy" dropdown
2. Select: "Deploy latest commit"
3. Wait: 2-3 minutes
```

### **✅ Done! Now auto-deploys on every git push**

---

## 🔑 **Key Settings Locations**

| What | Where | Value |
|------|-------|-------|
| Auto-Deploy | Settings → Build & Deploy | **Yes** |
| Build Cmd | Settings → Build & Deploy | `cd server && npm install` |
| Start Cmd | Settings → Build & Deploy | `cd server && npm start` |
| Branch | Settings → Build & Deploy | `main` |
| Env Vars | Environment tab | Already configured ✅ |

---

## 📋 **What to Check**

### ✅ Checklist:
- [ ] Auto-Deploy = Yes
- [ ] Build Command = `cd server && npm install`
- [ ] Start Command = `cd server && npm start`
- [ ] Branch = main
- [ ] Environment variables exist (9 variables)
- [ ] GitHub webhook active
- [ ] Latest commit deployed

---

## 🚀 **After Configuration**

### **Every time you push:**
```bash
git push origin main
# → Render auto-deploys in 2-3 minutes
```

### **No more manual deploys needed!**

---

## 🔍 **Verify It's Working**

### **Test 1: Check Service**
```
Go to: https://budget-buddy-h1k2.onrender.com/api/health
Should show: {"status": "OK", ...}
```

### **Test 2: Check Logs**
```
Dashboard → Logs tab
Should show: "Deploy succeeded ✅"
```

### **Test 3: Test Auto-Deploy**
```bash
# Make a change
echo "// Test" >> server/server.js
git add server/server.js
git commit -m "Test auto-deploy"
git push origin main

# Check Render logs - should deploy automatically
```

---

## 🆘 **Quick Troubleshooting**

### **Issue: Build fails**
```
Settings → Build Command
Must be: cd server && npm install
```

### **Issue: Service won't start**
```
Settings → Start Command
Must be: cd server && npm start
```

### **Issue: Auto-deploy not working**
```
Settings → Auto-Deploy
Must be: ● Yes (toggle ON)
```

### **Issue: Wrong branch**
```
Settings → Branch
Must be: main
```

---

## 📚 **Full Guides Available**

1. **RENDER_VISUAL_GUIDE.md** - Screenshots & visual walkthrough
2. **RENDER_CONFIGURATION_GUIDE.md** - Detailed step-by-step
3. **RENDER_AUTO_DEPLOY_SETUP.md** - Auto-deploy explanation
4. **DEPLOYMENT_SUMMARY.md** - Overall deployment overview

---

## 🎯 **The 3 Commands You Need**

### **Backend Only:**
```bash
cd server/
# make changes...
git add .
git commit -m "Update backend"
git push origin main
# Auto-deploys to Render
```

### **Frontend Only:**
```bash
cd client/
npm run build
cd ..
git add -f client/build
git commit -m "Update frontend"
git push origin main
# Auto-deploys to GitHub Pages
```

### **Both:**
```bash
cd client/ && npm run build && cd ..
git add .
git commit -m "Update full stack"
git push origin main
# Both auto-deploy
```

---

## ✅ **You're All Set!**

Your configuration is complete. Just push to GitHub and Render handles the rest! 🚀

**Questions?** Check the full guides in your project folder.
