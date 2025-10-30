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

  // Memoize reaction functions to avoid dependency issues
  const triggerReactions = useCallback(() => {
    if (summary) {
      const { totalIncome, totalExpenses } = summary.summary;
      const savings = totalIncome - totalExpenses;
      const savingsRatePercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
      
      // Savings reactions based on savings rate (percentage of income saved)
      if (savingsRatePercentage >= 60) {
        // Great savings rate (>= 60% of income saved) - celebrate!
        celebrate();
      } else if (savingsRatePercentage >= 40) {
        // Good savings rate (40-59% saved) - idle/steady
        idle();
      } else if (savingsRatePercentage >= 20) {
        // Moderate savings rate (20-39% saved) - encourage
        encourage();
      } else if (savingsRatePercentage >= 5) {
        // Low savings rate (5-19% saved) - worry
        worry();
      } else {
        // Very low or negative savings (< 5%) - worry more
        worry();
      }
    }
  }, [summary, celebrate, encourage, idle, worry]);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    triggerReactions();
  }, [triggerReactions]);

  const loadDashboardData = async () => {
    try {
      const [summaryRes, transactionsRes] = await Promise.all([
        reportAPI.getSummary(),
        transactionAPI.getAll()
      ]);

      setSummary(summaryRes.data);
      setRecentTransactions(transactionsRes.data.slice(0, 5));
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

  // Calculate progress toward savings goal
  const goalProgress = savingsGoal > 0 ? (savings / savingsGoal) * 100 : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Here's your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-4 mb-4">
        <div className="stat-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Income</p>
            <h2 className="stat-value">₹{totalIncome.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <p className="stat-label">Total Expenses</p>
            <h2 className="stat-value">₹{totalExpenses.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card balance">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <p className="stat-label">Balance</p>
            <h2 className="stat-value">₹{balance.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card savings">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <p className="stat-label">Savings Goal</p>
            <h2 className="stat-value">₹{savingsGoal.toFixed(2)}</h2>
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
            <span>₹{savings.toFixed(2)} saved / ₹{savingsGoal.toFixed(2)} goal</span>
          </div>
          <div className="progress-info" style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            <span>💡 Savings rate: {savingsPercentage.toFixed(1)}% of income</span>
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
