/**
 * Reports Page
 * View financial summaries and export data
 */

import React, { useState, useEffect, useCallback } from 'react';
import { reportAPI, transactionAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './Reports.css';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('current-month'); // 'current-month' or 'all-time'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      if (viewMode === 'all-time') {
        // Get all transactions and calculate summary
        const transactionsRes = await transactionAPI.getAll();
        const allTransactions = transactionsRes.data;
        
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
        
        const savingsGoal = 20000;
        const savings = balance;
        const savingsPercentage = totalIncome > 0 ? ((savings / totalIncome) * 100) : 0;
        
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
          transactions: allTransactions,
          transactionCount: {
            income: allTransactions.filter(t => t.type === 'income').length,
            expense: allTransactions.filter(t => t.type === 'expense').length,
            total: allTransactions.length
          }
        });
      } else {
        // Get monthly summary from API
        const response = await reportAPI.getSummary({
          month: selectedMonth,
          year: selectedYear
        });
        setSummary(response.data);
      }
    } catch (error) {
      toast.error('Failed to load summary');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedMonth, selectedYear]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleExportCSV = async () => {
    // Get period description for confirmation
    const periodDesc = viewMode === 'all-time' 
      ? 'All Time' 
      : `${new Date(2000, selectedMonth - 1, 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`;
    
    const transactionCount = summary?.transactionCount?.total || 0;
    
    const confirmed = window.confirm(
      `📊 Export CSV Report\n\n` +
      `Period: ${periodDesc}\n` +
      `Transactions: ${transactionCount}\n` +
      `Income: ₹${(summary?.summary?.totalIncome || 0).toFixed(2)}\n` +
      `Expenses: ₹${(summary?.summary?.totalExpenses || 0).toFixed(2)}\n\n` +
      `Do you want to proceed with the export?`
    );
    
    if (!confirmed) {
      toast.info('Export cancelled');
      return;
    }
    
    try {
      if (viewMode === 'all-time') {
        // For all-time, we need to export without month/year filter
        const response = await reportAPI.exportCSV({});
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_all_time.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const response = await reportAPI.exportCSV({
          month: selectedMonth,
          year: selectedYear
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_${selectedMonth}_${selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    // Get period description for confirmation
    const periodDesc = viewMode === 'all-time' 
      ? 'All Time' 
      : `${new Date(2000, selectedMonth - 1, 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`;
    
    const transactionCount = summary?.transactionCount?.total || 0;
    
    const confirmed = window.confirm(
      `📄 Export PDF Report\n\n` +
      `Period: ${periodDesc}\n` +
      `Transactions: ${transactionCount}\n` +
      `Income: ₹${(summary?.summary?.totalIncome || 0).toFixed(2)}\n` +
      `Expenses: ₹${(summary?.summary?.totalExpenses || 0).toFixed(2)}\n\n` +
      `Do you want to proceed with the export?`
    );
    
    if (!confirmed) {
      toast.info('Export cancelled');
      return;
    }
    
    try {
      if (viewMode === 'all-time') {
        // For all-time, we need to export without month/year filter
        const response = await reportAPI.exportPDF({});
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_all_time.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const response = await reportAPI.exportPDF({
          month: selectedMonth,
          year: selectedYear
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_${selectedMonth}_${selectedYear}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!summary) {
    return <div className="container">No data available</div>;
  }

  const { totalIncome, totalExpenses, balance } = summary.summary;
  const { categoryBreakdown, insights, transactions = [] } = summary;

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Financial Reports</h1>
          <p>View your financial summaries and export data</p>
        </div>
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
      </div>

      {/* Period Selector - Only show for current-month view */}
      {viewMode === 'current-month' && (
        <div className="card mb-4">
          <div className="period-selector">
            <div className="form-group">
              <label className="form-label">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="form-select"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="form-select"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

            <div className="export-buttons">
              <button className="btn btn-outline" onClick={handleExportCSV}>
                📊 Export CSV
              </button>
              <button className="btn btn-outline" onClick={handleExportPDF}>
                📄 Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export buttons for All Time view */}
      {viewMode === 'all-time' && (
        <div className="card mb-4">
          <div className="export-buttons-fullwidth">
            <button className="btn btn-outline" onClick={handleExportCSV}>
              📊 Export CSV (All Time)
            </button>
            <button className="btn btn-outline" onClick={handleExportPDF}>
              📄 Export PDF (All Time)
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-3 mb-4">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p className="amount income">₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount expense">₹{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Net Balance</h3>
          <p className={`amount ${balance >= 0 ? 'income' : 'expense'}`}>
            ₹{balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card mb-4">
        <h3 className="card-title">Expense Breakdown by Category</h3>
        {Object.keys(categoryBreakdown).length > 0 ? (
          <div className="category-list">
            {Object.entries(categoryBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                return (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">{category}</span>
                      <span className="category-amount">₹{amount.toFixed(2)}</span>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="category-percentage">{percentage}%</span>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-center">No expense data for this period</p>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="card mb-4">
          <h3 className="card-title">💡 Financial Insights</h3>
          <ul className="insights-list">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transactions List */}
      <div className="card transactions-section">
        <div className="section-header">
          <h3 className="card-title">📋 Transaction Details</h3>
          <button 
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            🖨️ Print Report
          </button>
        </div>
        
        {transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <div>{format(new Date(transaction.date), 'MMM dd, yyyy')}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {format(new Date(transaction.date), 'HH:mm')}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.category}</td>
                    <td className={`amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </td>
                    <td>{transaction.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colspan="3"><strong>Total</strong></td>
                  <td><strong className="amount income">+₹{totalIncome.toFixed(2)}</strong></td>
                  <td></td>
                </tr>
                <tr className="total-row">
                  <td colspan="3"><strong>Total Expenses</strong></td>
                  <td><strong className="amount expense">-₹{totalExpenses.toFixed(2)}</strong></td>
                  <td></td>
                </tr>
                <tr className="total-row highlight">
                  <td colspan="3"><strong>Net Balance</strong></td>
                  <td>
                    <strong className={`amount ${balance >= 0 ? 'income' : 'expense'}`}>
                      ₹{balance.toFixed(2)}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="text-center">No transactions for this period</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
