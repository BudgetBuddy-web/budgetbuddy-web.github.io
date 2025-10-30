# 🎯 BudgetBuddy: Interactive Expense Tracker with Anime Assistant

A production-ready full-stack MERN (MongoDB, Express, React, Node.js) personal finance management application featuring an interactive Live2D anime assistant named **Akari**. BudgetBuddy makes budgeting engaging, visual, and emotionally rewarding by helping users track expenses, monitor savings goals, and make informed financial decisions with real-time feedback and motivation.

---

## 🌟 Key Features

### 🎭 **Live2D Anime Assistant (Akari)**
- **Realistic VTube Character** - Full 3D anime assistant with physics-based movements
- **Dynamic Expressions** - Changes facial expressions based on your financial actions
  - 😊 Happy, 🎉 Excited, 😢 Sad, 😱 Shocked, 🤔 Thinking, 🙈 Shy
- **Interactive Animations** - Idle, Love, Shock motions with Live2D Cubism
- **Mood-Based Reactions**:
  - ≥60% savings rate → Celebrate (excited, "Amazing!")
  - 40-59% savings → Idle (steady, "Looking good!")
  - 20-39% savings → Encourage (happy, "Keep up!")
  - 5-19% savings → Worry (sad, "Careful...")
  - <5% savings → Worry more (sad, strong warning)
  - Large expense (>₹1000) → Shock (shocked, "Whoa!")
  - Password typing → Cover eyes (shy, "I won't peek!")
- **Performance Optimized** - Lazy loading saves 500KB on initial load

### 🔐 **Secure Authentication**
- Email/password login with bcrypt hashing
- JWT token-based authentication
- Google OAuth 2.0 integration
- Protected routes with middleware

### 📊 **Transaction Management**
- Full CRUD operations (Create, Read, Update, Delete)
- **Categories**: Food, Travel, Entertainment, Shopping, Healthcare, Education, Utilities, Rent, Salary, Freelance, Investment, Other
- Date/time tracking with datetime picker
- Sortable tables (by date, type, category, amount)
- Real-time balance calculations

### 📈 **Financial Analytics**
- Interactive charts with Chart.js (lazy loaded)
- Category-wise expense breakdown
- Income vs Expenses comparison graphs
- Savings rate tracking (% of income saved)
- Smart insights based on spending patterns
- Visual progress indicators

### 💾 **Reports & Export**
- Monthly financial summaries
- Export as PDF (PDFKit)
- Export as CSV (json2csv)
- Period selection (month/year)
- Downloadable transaction history

### ⚙️ **Personalization**
- **Themes**: Light, Dark, Auto (system preference)
- **Assistant Personalities**:
  - 😊 Cheerful - Enthusiastic and energetic
  - 😌 Calm - Balanced and encouraging
  - 😐 Strict - Direct and goal-focused
- Custom savings goals
- Profile management with avatar
- Secure account deletion

### 🚀 **Performance Optimizations**
- Code splitting with React.lazy (50% bundle reduction)
- Compressed Live2D texture (7.1MB → 1.8MB, 75% reduction)
- Lazy loaded libraries (PIXI.js, Live2D)
- Mobile-optimized responsive design
- Touch-friendly UI (44px minimum touch targets)

---

## 🧩 Tech Stack

### **Frontend**
- **React** 18.2 with Hooks
- **React Router** 6 (navigation)
- **Chart.js** 4 (data visualization)
- **PIXI.js** 7 + **Live2D Cubism** (anime assistant)
- **Axios** (HTTP client)
- **date-fns** (date formatting)
- **react-toastify** (notifications)

### **Backend**
- **Node.js** + **Express** 4
- **MongoDB** + **Mongoose** 8
- **bcryptjs** (password hashing)
- **jsonwebtoken** (JWT authentication)
- **Google Auth Library** (OAuth)
- **PDFKit** (PDF generation)
- **json2csv** (CSV export)
- **Helmet** (security headers)
- **Morgan** (logging)
- **CORS** (cross-origin requests)

---

## 📂 Project Structure

```
BudgetBuddy/
├── client/                 # React frontend
│   ├── public/            # Static assets + Live2D model
│   │   ├── index.html
│   │   └── akari_vts/     # Live2D character files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── AnimeAssistant.js
│   │   │   ├── DashboardCharts.js
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── Layout.js
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── Transactions.js
│   │   │   ├── Reports.js
│   │   │   ├── Settings.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── contexts/      # State management
│   │   │   ├── AuthContext.js
│   │   │   ├── AssistantContext.js
│   │   │   └── ThemeContext.js
│   │   ├── services/      # API services
│   │   │   └── api.js
│   │   ├── utils/         # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Business logic
│   │   ├── auth.controller.js
│   │   ├── transaction.controller.js
│   │   ├── report.controller.js
│   │   └── user.controller.js
│   ├── models/            # Database schemas
│   │   ├── User.model.js
│   │   └── Transaction.model.js
│   ├── routes/            # API endpoints
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   ├── report.routes.js
│   │   └── user.routes.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.middleware.js
│   ├── utils/             # Helper functions
│   │   └── seed.js
│   ├── server.js
│   └── package.json
│
├── akari_vts/             # Live2D model source
├── start.sh               # Quick start script
└── README.md
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **Easy Setup (Recommended)**

Use the quick start script:
```bash
chmod +x start.sh
./start.sh
```

### **Manual Setup**

#### **1. Backend Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `server/.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/budgetbuddy
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id (optional)
GOOGLE_CLIENT_SECRET=your_google_client_secret (optional)
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

```bash
# Seed demo data (optional)
node utils/seed.js

# Start server
npm start
```

Server runs on `http://localhost:5000`

#### **2. Frontend Setup**

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env
```

Edit `client/.env` (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id (optional)
```

```bash
# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

### **3. Demo Credentials**

After seeding, use these credentials to login:
```
Email: david@example.com
Password: password123
```

---

## 📝 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user (protected)

### **Transactions**
- `GET /api/transactions` - Get all transactions (protected)
- `GET /api/transactions/:id` - Get single transaction (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

**Query Parameters:**
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `type` - Filter by income/expense
- `category` - Filter by category

### **Reports**
- `GET /api/reports/summary` - Get financial summary (protected)
- `GET /api/reports/export/csv` - Export as CSV (protected)
- `GET /api/reports/export/pdf` - Export as PDF (protected)

**Query Parameters:**
- `month` - Month number (1-12)
- `year` - Year number

### **User**
- `PUT /api/user/profile` - Update profile (protected)
- `PUT /api/user/budget` - Update savings goal (protected)
- `PUT /api/user/settings` - Update settings (protected)
- `DELETE /api/user/account` - Delete account (protected)

---

## 🗄️ Database Schema

### **Users Collection**
```javascript
{
  name: String,                    // User's full name
  email: String,                   // Unique email (required)
  password: String,                // Hashed password (bcrypt)
  googleId: String,                // Google OAuth ID (optional)
  savingsGoal: Number,             // Monthly savings target (default: 5000)
  profilePic: String,              // Profile picture URL
  assistantPersonality: String,    // cheerful | calm | strict
  theme: String,                   // light | dark | auto
  createdAt: Date,
  updatedAt: Date
}
```

### **Transactions Collection**
```javascript
{
  userId: ObjectId,                // Reference to User
  type: String,                    // income | expense
  category: String,                // Food, Travel, Salary, etc.
  amount: Number,                  // Transaction amount (positive)
  date: Date,                      // Transaction date
  note: String,                    // Optional description
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId + date` (descending)
- `userId + type`

---

## 🎭 Live2D Anime Assistant

### **Technical Details**
- Built with **PIXI.js 7** and **pixi-live2d-display**
- Uses **Live2D Cubism SDK** for character rendering
- Model includes expressions, motions, and physics simulation
- Fully responsive (works on mobile and desktop)
- Optimized texture (compressed from 7.1MB to 1.8MB)

### **Available Expressions**
- `EyesLove` - Heart eyes
- `EyesCry` - Teary eyes
- `SignAngry` - Annoyed expression
- `SignShock` - Surprised expression

### **Available Motions**
- `Idle` - Idle animation loop
- `Love` - Happy celebration animation
- `Shock` - Surprised reaction animation

### **Interaction**
The assistant automatically reacts based on your financial behavior:
- **Savings ≥60%** → "🎉 Amazing! You're doing great!"
- **Savings 40-59%** → "😊 Looking good! Keep it steady."
- **Savings 20-39%** → "💪 Keep up the good work!"
- **Savings 5-19%** → "😟 Careful with your spending..."
- **Savings <5%** → Strong warning about overspending
- **Large Expense** → "😱 Whoa! That's a big expense!"

---

## 📱 Mobile Optimization

### **Responsive Breakpoints**
- **Desktop** (>768px) - Full features
- **Tablet** (481px - 768px) - Optimized layout
- **Mobile** (≤480px) - Compact layout

### **Mobile-Specific Features**
- Touch-friendly buttons (minimum 44x44px)
- Reduced assistant size (50% smaller on mobile)
- Responsive grid layouts (stack on mobile)
- Optimized font sizes for readability
- Smooth scrolling and reduced animations

### **Testing on Mobile**

**Option 1: Browser DevTools**
1. Open http://localhost:3000
2. Press F12 (DevTools)
3. Click device toolbar (Ctrl+Shift+M)
4. Select a mobile device

**Option 2: On Your Phone (Same WiFi)**
1. Find your computer's IP:
   ```bash
   hostname -I | awk '{print $1}'
   # Example: 192.168.1.100
   ```
2. On your phone: `http://YOUR_IP:3000`

---

## 🎨 Available Scripts

### **Client Scripts**
```bash
npm start          # Run development server
npm build          # Build for production
npm test           # Run tests
npm eject          # Eject from Create React App
```

### **Server Scripts**
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
node utils/seed.js # Seed demo data
```

---

## 🔧 Configuration

### **Environment Variables**

**Server (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/budgetbuddy
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## 🎯 Usage Guide

### **1. Login**
- Use demo credentials or register a new account
- Optional: Login with Google OAuth

### **2. Dashboard**
- View financial overview and statistics
- See category-wise expense breakdown
- Monitor savings progress
- Watch Akari react to your financial behavior!

### **3. Add Transactions**
1. Click "Add Transaction" button
2. Select type (Income/Expense)
3. Choose category
4. Enter amount and date
5. Add optional note
6. Watch Akari celebrate or react!

### **4. View Reports**
- Select month and year
- View detailed financial summaries
- Export as PDF or CSV
- Analyze spending patterns

### **5. Customize Settings**
- Update profile information
- Set savings goals
- Change theme (Light/Dark/Auto)
- Select assistant personality
- Delete account (if needed)

---

## 🏆 Performance Metrics

### **Before Optimization**
- Initial Bundle: ~2-3 MB
- Live2D Texture: 7.1 MB
- Total First Load: ~10 MB
- Time to Interactive: 4-6 seconds

### **After Optimization**
- Initial Bundle: ~1-1.5 MB (50% reduction)
- Live2D Texture: 1.8 MB (75% reduction)
- Total First Load: ~4-5 MB (60% reduction)
- Time to Interactive: 2-3 seconds (50% faster)

---

## 🛠️ Development

### **Code Structure**
- **Components**: Reusable UI components
- **Pages**: Full page components with routing
- **Contexts**: Global state management (Auth, Theme, Assistant)
- **Services**: API calls and HTTP client configuration
- **Controllers**: Server-side business logic
- **Models**: MongoDB schemas
- **Routes**: API endpoint definitions
- **Middleware**: Request processing (auth, validation)

### **Best Practices**
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Code splitting and lazy loading
- ✅ Responsive design
- ✅ Dark theme support

---

## 🐛 Troubleshooting

### **Common Issues**

**1. MongoDB Connection Error**
```bash
# Make sure MongoDB is running
sudo systemctl start mongod
# or
mongod
```

**2. Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**3. Live2D Model Not Loading**
- Check browser console for errors
- Ensure `live2dcubismcore.min.js` is loaded
- Clear browser cache
- Check file paths in model3.json

**4. Google OAuth Errors**
- Verify `GOOGLE_CLIENT_ID` is correct
- Check authorized redirect URIs in Google Console
- Ensure credentials match in both .env files

---

## 📚 Documentation

- **PROJECT_DESCRIPTION.md** - Detailed project overview
- **HOW_TO_RUN.md** - Step-by-step running instructions
- **QUICK_START.md** - Quick reference guide
- **OPTIMIZATION_SUMMARY.md** - Performance optimization details
- **MOBILE_OPTIMIZATION.md** - Mobile features and setup
- **GOOGLE_OAUTH_SETUP.md** - Google OAuth configuration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### **Guidelines**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for learning or production.

```
MIT License

Copyright (c) 2025 David Oliver

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**David Oliver**

---

## 🙏 Acknowledgments

- Live2D Cubism SDK for character animations
- PIXI.js for WebGL rendering
- MongoDB for database
- React team for amazing framework
- All open-source contributors

---

## 📞 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check documentation files
- Review troubleshooting section

---

<div align="center">

**Made with ❤️ and lots of ☕**

⭐ **Star this repo if you find it helpful!** ⭐

[Report Bug](https://github.com/davidnaruto11/Budget-Buddy) 

</div>
