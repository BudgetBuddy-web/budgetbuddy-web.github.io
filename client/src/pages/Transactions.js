/**
 * Transactions Page
 * Manage income and expense transactions
 */

import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { useAssistant } from '../contexts/AssistantContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './Transactions.css';

const CATEGORIES = [
  'Food', 'Travel', 'Entertainment', 'Shopping', 'Healthcare',
  'Education', 'Utilities', 'Rent', 'Salary', 'Freelance', 'Investment', 'Other'
];

const Transactions = () => {
  const { celebrate, shock, think } = useAssistant();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    note: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    think();

    try {
      if (editingTransaction) {
        await transactionAPI.update(editingTransaction._id, formData);
        toast.success('Transaction updated successfully');
      } else {
        await transactionAPI.create(formData);
        toast.success('Transaction added successfully');
        
        // Trigger assistant reaction
        if (formData.type === 'income') {
          celebrate();
        } else if (parseFloat(formData.amount) > 1000) {
          shock();
        }
      }

      loadTransactions();
      resetForm();
    } catch (error) {
      toast.error('Failed to save transaction');
      console.error(error);
    }
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted transactions
  const getSortedTransactions = () => {
    const sorted = [...transactions].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: format(new Date(transaction.date), "yyyy-MM-dd'T'HH:mm:ss"),
      note: transaction.note || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionAPI.delete(id);
      toast.success('Transaction deleted successfully');
      loadTransactions();
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: 'Food',
      amount: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      note: ''
    });
    setEditingTransaction(null);
    setShowModal(false);
  };

  const handleAddNew = () => {
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      category: 'Food',
      amount: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"), // Set current time when opening
      note: ''
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="transactions-page">
      <div className="page-header flex-between">
        <div>
          <h1>Transactions</h1>
          <p>Manage your income and expenses</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add Transaction
        </button>
      </div>

      {/* Transactions List */}
      <div className="card">
        {transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')} className="sortable">
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('type')} className="sortable">
                    Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('category')} className="sortable">
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('amount')} className="sortable">
                    Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedTransactions().map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <div>{format(new Date(transaction.date), 'MMM dd, yyyy')}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {format(new Date(transaction.date), 'HH:mm:ss')}
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
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action edit"
                          onClick={() => handleEdit(transaction)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-action delete"
                          onClick={() => handleDelete(transaction._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No transactions yet. Add your first transaction!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="btn-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control"
                    step="1"
                    required
                  />
                  <small className="form-text" style={{ fontSize: '12px', color: '#888' }}>
                    ⏰ Auto-filled with current time. Click to change manually.
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Note (optional)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Add a note..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
