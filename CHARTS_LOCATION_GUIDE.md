# 📊 Charts Location Guide

This document shows where all charts/graphs are located in the BudgetBuddy application.

---

## 📍 Chart Locations

### 1. **AdminDashboard.js** 
**File:** `/client/src/pages/AdminDashboard.js`

Contains **3 charts**:

#### 📈 Line Chart - User Registration Trend
```javascript
// Line 648 approximately
<Line data={stats.registrationData} options={chartOptions} />
```
- **Location:** Top left section of admin dashboard
- **Shows:** New user signups over time
- **Card ID:** `registration-chart`

#### 📊 Bar Chart - Login Frequency Distribution  
```javascript
// Line 678 approximately
<Bar data={stats.loginData} options={chartOptions} />
```
- **Location:** Bottom left section of admin dashboard
- **Shows:** How often users visit (Daily, Weekly, Monthly, Rarely)
- **Card ID:** `activity-chart`

#### 🥧 Pie Chart - User Activity Status
```javascript
// Line 661 approximately
<Pie data={stats.activityData} options={pieOptions} />
```
- **Location:** Top right section of admin dashboard
- **Shows:** Active vs Inactive users
- **Card ID:** `pie-chart`

---

### 2. **DashboardCharts.js**
**File:** `/client/src/components/DashboardCharts.js`

Contains **2 charts**:

#### 🥧 Pie Chart - Category Breakdown
```javascript
// Line 124 approximately
<Pie data={pieData} options={pieOptions} />
```
- **Location:** Left side of user dashboard
- **Shows:** Expense breakdown by category (Food, Transport, etc.)
- **Card Title:** "Category Breakdown"

#### 📊 Bar Chart - Income vs Expenses
```javascript
// Line 133 approximately
<Bar data={barData} options={barOptions} />
```
- **Location:** Right side of user dashboard
- **Shows:** Total income vs total expenses comparison
- **Card Title:** "Income vs Expenses"

---

## 🎨 Chart Styling Configuration

### Light Mode (Default)
```css
/* Text Colors */
.chartOptions {
  color: #000000;  /* BLACK text for all labels */
}
```

All chart text elements in light mode:
- ✅ Legend labels: **Black** `#000000`
- ✅ X-axis labels: **Black** `#000000`
- ✅ Y-axis labels: **Black** `#000000`
- ✅ Tick numbers: **Black** `#000000`
- ✅ Grid lines: **Light gray** `#e1e8ed`

### Dark Mode
```css
/* Dark Theme Override */
.dark-theme .chartOptions {
  color: #ffffff;  /* WHITE text for all labels */
}
```

All chart text elements in dark mode:
- ✅ Legend labels: **White** `#ffffff`
- ✅ X-axis labels: **White** `#ffffff`
- ✅ Y-axis labels: **White** `#ffffff`
- ✅ Tick numbers: **White** `#ffffff`
- ✅ Grid lines: **Dark gray** `#475569`

---

## 🔧 How Chart Colors Work

Both chart components use **MutationObserver** to detect theme changes:

```javascript
// Detect theme for chart colors with reactive state
const [isDarkTheme, setIsDarkTheme] = useState(
  document.body.classList.contains('dark-theme')
);

// Update theme detection when theme changes
useEffect(() => {
  const observer = new MutationObserver(() => {
    setIsDarkTheme(document.body.classList.contains('dark-theme'));
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  return () => observer.disconnect();
}, []);

const textColor = isDarkTheme ? '#ffffff' : '#000000';
const gridColor = isDarkTheme ? '#475569' : '#e1e8ed';
```

---

## 📋 Quick Reference

| Component | Charts | Access Level |
|-----------|--------|--------------|
| **AdminDashboard.js** | Line, Bar, Pie (3 total) | Admin only |
| **DashboardCharts.js** | Pie, Bar (2 total) | All users |

---

## 🎯 Chart Options Structure

### For Line & Bar Charts (chartOptions)
```javascript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: textColor,        // Black or White
        font: { size: 12, weight: '500' }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: textColor,        // Black or White
        font: { size: 11 }
      },
      grid: {
        color: gridColor,        // Light or Dark gray
        display: true
      }
    },
    y: {
      ticks: {
        color: textColor,        // Black or White
        font: { size: 11 }
      },
      grid: {
        color: gridColor,        // Light or Dark gray
        display: true
      }
    }
  }
};
```

### For Pie Charts (pieOptions)
```javascript
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: textColor,        // Black or White
        font: { size: 12, weight: '500' },
        padding: 15
      }
    },
    tooltip: {
      backgroundColor: isDarkTheme ? '#16213e' : '#ffffff',
      titleColor: textColor,   // Black or White
      bodyColor: textColor,    // Black or White
      borderColor: gridColor,  // Light or Dark gray
      borderWidth: 1
    }
  }
};
```

---

## ✅ All Charts Are Now Theme-Aware!

- Charts automatically detect theme changes
- Text colors update instantly when toggling dark/light mode
- No page refresh needed
- All labels, legends, axes, and tooltips are visible in both themes

---

**Last Updated:** November 2, 2025
