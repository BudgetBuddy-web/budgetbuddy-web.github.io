/**
 * Dashboard Page
 * Main dashboard with financial overview and charts
 * Optimized with lazy loading for charts
 */

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAssistant } from '../contexts/AssistantContext';
import { transactionAPI, reportAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

// Lazy load charts to reduce initial bundle size
const Charts = lazy(() => import('../components/DashboardCharts'));

const Dashboard = () => {
  const { user } = useAuth();
  const { celebrate, worry, encourage, idle } = useAssistant();
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('current-month'); // 'current-month' or 'all-time'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyGoalProgress, setMonthlyGoalProgress] = useState(0); // For assistant reactions (percentage of goal achieved)

  // Memoize reaction functions to avoid dependency issues
  const triggerReactions = useCallback(() => {
    // React based on monthly goal progress (percentage of savings goal achieved)
    const goalProgressPercentage = monthlyGoalProgress;
    
    // Reactions based on progress toward savings goal
    if (goalProgressPercentage >= 100) {
      // Goal exceeded! - celebrate!
      celebrate();
    } else if (goalProgressPercentage >= 75) {
      // Great progress (75-99%) - celebrate
      celebrate();
    } else if (goalProgressPercentage >= 50) {
      // Good progress (50-74%) - idle/steady
      idle();
    } else if (goalProgressPercentage >= 25) {
      // Moderate progress (25-49%) - encourage
      encourage();
    } else if (goalProgressPercentage >= 10) {
      // Low progress (10-24%) - worry
      worry();
    } else {
      // Very low progress (< 10%) - worry more
      worry();
    }
  }, [monthlyGoalProgress, celebrate, encourage, idle, worry]);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedMonth, selectedYear]); // Reload when view mode or date changes

  useEffect(() => {
    triggerReactions();
  }, [triggerReactions]);

  const loadDashboardData = async () => {
    try {
      // Get all transactions first
      const transactionsRes = await transactionAPI.getAll();
      const allTransactions = transactionsRes.data;
      
      // Set recent transactions
      setRecentTransactions(allTransactions.slice(0, 5));
      
      // ALWAYS calculate current month's goal progress for assistant reactions
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);
      
      const currentMonthTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd;
      });
      
      const currentMonthIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const currentMonthExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const currentMonthSavings = currentMonthIncome - currentMonthExpenses;
      const monthlySavingsGoal = user?.savingsGoal || 20000;
      
      // Calculate goal progress percentage (how much of the goal is achieved)
      const goalProgress = monthlySavingsGoal > 0 
        ? (currentMonthSavings / monthlySavingsGoal) * 100 
        : 0;
      
      // Set monthly goal progress for assistant reactions
      setMonthlyGoalProgress(goalProgress);
      
      // Calculate summary based on view mode
      if (viewMode === 'all-time') {
        // Calculate all-time totals from all transactions
        const totalIncome = allTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = allTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = totalIncome - totalExpenses;
        
        // Category breakdown
        const categoryBreakdown = {};
        allTransactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
          });
        
        // Calculate savings
        const savingsGoal = user?.allTimeGoal || 20000;
        const savings = balance;
        const savingsPercentage = totalIncome > 0 ? ((savings / totalIncome) * 100) : 0;
        
        // Generate insights
        const insights = [];
        if (savings >= savingsGoal) {
          insights.push(`Excellent! You saved ₹${savings.toFixed(2)}, exceeding your goal by ₹${(savings - savingsGoal).toFixed(2)}`);
        } else if (savings > 0) {
          insights.push(`You saved ₹${savings.toFixed(2)} (${savingsPercentage.toFixed(2)}% of income)`);
        } else if (savings < 0) {
          insights.push(`Warning: You spent ₹${Math.abs(savings).toFixed(2)} more than you earned`);
        }
        
        const highestCategory = Object.entries(categoryBreakdown)
          .sort((a, b) => b[1] - a[1])[0];
        if (highestCategory) {
          insights.push(`Your highest expense category is ${highestCategory[0]} (₹${highestCategory[1].toFixed(2)})`);
        }
        
        setSummary({
          period: {
            display: 'All Time'
          },
          summary: {
            totalIncome,
            totalExpenses,
            balance,
            savingsGoal,
            savings,
            savingsPercentage
          },
          categoryBreakdown,
          insights,
          transactionCount: {
            income: allTransactions.filter(t => t.type === 'income').length,
            expense: allTransactions.filter(t => t.type === 'expense').length,
            total: allTransactions.length
          }
        });
      } else {
        // Get current month summary from API
        const summaryRes = await reportAPI.getSummary({
          month: selectedMonth,
          year: selectedYear
        });
        setSummary(summaryRes.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!summary) {
    return <div className="container">No data available</div>;
  }

  const { totalIncome, totalExpenses, balance, savingsGoal, savings, savingsPercentage } = summary.summary;
  const { categoryBreakdown, insights } = summary;

  // Ensure all values are numbers with defaults
  const safeIncome = Number(totalIncome) || 0;
  const safeExpenses = Number(totalExpenses) || 0;
  const safeBalance = Number(balance) || 0;
  const safeSavingsGoal = Number(savingsGoal) || 20000;
  const safeSavings = Number(savings) || 0;
  const safeSavingsPercentage = Number(savingsPercentage) || 0;

  // Calculate progress toward savings goal
  const goalProgress = safeSavingsGoal > 0 ? (safeSavings / safeSavingsGoal) * 100 : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's your financial overview</p>
        </div>
        <div className="header-controls">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'current-month' ? 'active' : ''}`}
              onClick={() => setViewMode('current-month')}
            >
              📅 This Month
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'all-time' ? 'active' : ''}`}
              onClick={() => setViewMode('all-time')}
            >
              🌍 All Time
            </button>
          </div>
          
          {viewMode === 'current-month' && (
            <div className="month-selector">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="month-select"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'short' })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="year-select"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
            {/* Summary Cards */}
      <div className="grid grid-4 mb-4">
        <div className="stat-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Income</p>
            <h2 className="stat-value">₹{safeIncome.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <p className="stat-label">Total Expenses</p>
            <h2 className="stat-value">₹{safeExpenses.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card balance">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <p className="stat-label">Balance</p>
            <h2 className="stat-value">₹{safeBalance.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card goal">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <p className="stat-label">Savings Goal</p>
            <h2 className="stat-value">₹{safeSavingsGoal.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      {/* Savings Progress */}
      <div className="card mb-4">
        <h3 className="card-title">Savings Progress</h3>
        <div className="budget-progress">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${goalProgress >= 100 ? 'good-savings' : goalProgress < 10 ? 'low-savings' : ''}`}
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            ></div>
          </div>
          <div className="progress-info">
            <span>{goalProgress.toFixed(1)}% of goal achieved</span>
            <span>₹{safeSavings.toFixed(2)} saved / ₹{safeSavingsGoal.toFixed(2)} goal</span>
          </div>
          <div className="progress-info" style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            <span>💡 Savings rate: {safeSavingsPercentage.toFixed(1)}% of income</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="card mb-4">
          <h3 className="card-title">💡 Insights</h3>
          <ul className="insights-list">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Charts - Lazy loaded for performance */}
      <Suspense fallback={
        <div className="grid grid-2 mb-4">
          <div className="card">
            <h3 className="card-title">Category Breakdown</h3>
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading charts...</div>
          </div>
          <div className="card">
            <h3 className="card-title">Income vs Expenses</h3>
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading charts...</div>
          </div>
        </div>
      }>
        <Charts 
          categoryBreakdown={categoryBreakdown}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
      </Suspense>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="card-title">Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-icon">
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>
                <div className="transaction-details">
                  <p className="transaction-category">{transaction.category}</p>
                  <p className="transaction-note">{transaction.note || 'No description'}</p>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
