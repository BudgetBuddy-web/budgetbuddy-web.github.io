import React, { useState, useEffect } from 'react';
import { expensesAPI, budgetsAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import AkariAssistant from '../components/AkariAssistant';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

const Dashboard = () => {
  const [stats, setStats] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [akariContext, setAkariContext] = useState('welcome');
  const [akariMessage, setAkariMessage] = useState('');

  const [expenseForm, setExpenseForm] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [budgetForm, setBudgetForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    category: '',
    type: 'budget',
    deadline: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, expensesRes, budgetsRes] = await Promise.all([
        expensesAPI.getStats(),
        expensesAPI.getAll(),
        budgetsAPI.getAll()
      ]);

      setStats(statsRes.data);
      setExpenses(expensesRes.data);
      setBudgets(budgetsRes.data);

      // Check for high spending
      if (statsRes.data.totalExpenses > statsRes.data.totalIncome * 0.8) {
        setAkariContext('highSpending');
      } else if (budgetsRes.data.some(b => b.currentAmount >= b.targetAmount)) {
        setAkariContext('goalAchieved');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await expensesAPI.create({
        ...expenseForm,
        amount: parseFloat(expenseForm.amount)
      });
      
      setAkariContext(expenseForm.type === 'income' ? 'addIncome' : 'addExpense');
      setShowAddExpense(false);
      setExpenseForm({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await budgetsAPI.create({
        ...budgetForm,
        targetAmount: parseFloat(budgetForm.targetAmount),
        currentAmount: parseFloat(budgetForm.currentAmount) || 0
      });
      
      setShowAddBudget(false);
      setBudgetForm({
        name: '',
        targetAmount: '',
        currentAmount: 0,
        category: '',
        type: 'budget',
        deadline: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await expensesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // Prepare chart data
  const categoryData = expenses.reduce((acc, expense) => {
    if (expense.type === 'expense') {
      const existing = acc.find(item => item.name === expense.category);
      if (existing) {
        existing.value += expense.amount;
      } else {
        acc.push({ name: expense.category, value: expense.amount });
      }
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-3">
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <h3>Total Income</h3>
          <div className="value" style={{ color: '#10b981' }}>
            ${stats.totalIncome.toFixed(2)}
          </div>
        </div>
        
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h3>Total Expenses</h3>
          <div className="value" style={{ color: '#ef4444' }}>
            ${stats.totalExpenses.toFixed(2)}
          </div>
        </div>
        
        <div className="stat-card" style={{ borderLeft: '4px solid #667eea' }}>
          <h3>Balance</h3>
          <div className="value" style={{ color: stats.balance >= 0 ? '#10b981' : '#ef4444' }}>
            ${stats.balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
        <button className="btn btn-primary" onClick={() => setShowAddExpense(true)}>
          + Add Transaction
        </button>
        <button className="btn btn-primary" onClick={() => setShowAddBudget(true)}>
          + Add Goal
        </button>
      </div>

      <div className="grid grid-2">
        {/* Recent Transactions */}
        <div className="card">
          <h2>Recent Transactions</h2>
          {expenses.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No transactions yet. Add your first transaction!</p>
          ) : (
            <ul className="expense-list">
              {expenses.slice(0, 5).map(expense => (
                <li key={expense._id} className="expense-item">
                  <div className="expense-info">
                    <div className="expense-category">{expense.category}</div>
                    <div className="expense-date">
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                    {expense.description && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {expense.description}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`expense-amount ${expense.type}`}>
                      {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                    </div>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleDeleteExpense(expense._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Expense Categories Chart */}
        <div className="card">
          <h2>Expenses by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
              No expense data yet
            </p>
          )}
        </div>
      </div>

      {/* Budgets and Goals */}
      <div className="card">
        <h2>Budgets & Savings Goals</h2>
        {budgets.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No goals set yet. Create your first budget or savings goal!</p>
        ) : (
          <div className="grid grid-2">
            {budgets.map(budget => {
              const progress = (budget.currentAmount / budget.targetAmount) * 100;
              return (
                <div key={budget._id} className="card" style={{ background: '#f9fafb' }}>
                  <h3 style={{ marginBottom: '8px' }}>{budget.name}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    {budget.type === 'savings' ? '💰 Savings Goal' : '📊 Budget'}
                  </p>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      background: '#e5e7eb',
                      height: '24px',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: progress >= 100 ? '#10b981' : '#667eea',
                        height: '100%',
                        width: `${Math.min(progress, 100)}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>${budget.currentAmount.toFixed(2)}</span>
                    <span style={{ fontWeight: '600' }}>${budget.targetAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {progress.toFixed(1)}% complete
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Transaction</h2>
              <button className="close-btn" onClick={() => setShowAddExpense(false)}>×</button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={expenseForm.type}
                  onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  required
                  placeholder="e.g., Food, Salary, Entertainment"
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Add a note"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="modal-overlay" onClick={() => setShowAddBudget(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Budget/Goal</h2>
              <button className="close-btn" onClick={() => setShowAddBudget(false)}>×</button>
            </div>
            <form onSubmit={handleAddBudget}>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={budgetForm.type}
                  onChange={(e) => setBudgetForm({ ...budgetForm, type: e.target.value })}
                  required
                >
                  <option value="budget">Budget</option>
                  <option value="savings">Savings Goal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={budgetForm.name}
                  onChange={(e) => setBudgetForm({ ...budgetForm, name: e.target.value })}
                  required
                  placeholder="e.g., Emergency Fund, Monthly Food Budget"
                />
              </div>
              <div className="form-group">
                <label>Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetForm.targetAmount}
                  onChange={(e) => setBudgetForm({ ...budgetForm, targetAmount: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Current Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetForm.currentAmount}
                  onChange={(e) => setBudgetForm({ ...budgetForm, currentAmount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Category (optional)</label>
                <input
                  type="text"
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  placeholder="e.g., Housing, Travel"
                />
              </div>
              <div className="form-group">
                <label>Deadline (optional)</label>
                <input
                  type="date"
                  value={budgetForm.deadline}
                  onChange={(e) => setBudgetForm({ ...budgetForm, deadline: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Akari Assistant */}
      <AkariAssistant context={akariContext} customMessage={akariMessage} />
    </div>
  );
};

export default Dashboard;
