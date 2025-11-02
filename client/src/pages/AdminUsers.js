/**
 * Admin Users Management Page
 * View and manage all users with sorting and inactivity tracking
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  
  // Sorting states
  const [adminSortField, setAdminSortField] = useState('name');
  const [adminSortDirection, setAdminSortDirection] = useState('asc');
  const [userSortField, setUserSortField] = useState('inactivityDays');
  const [userSortDirection, setUserSortDirection] = useState('desc');

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      toast.error('Access denied: Admin only');
      navigate('/dashboard');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const calculateInactivityDays = (lastActivity) => {
    if (!lastActivity) return 0;
    const now = new Date();
    const lastActiveDate = new Date(lastActivity);
    const diffTime = Math.abs(now - lastActiveDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSort = (field, tableType) => {
    if (tableType === 'admin') {
      if (adminSortField === field) {
        setAdminSortDirection(adminSortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setAdminSortField(field);
        setAdminSortDirection('asc');
      }
    } else {
      if (userSortField === field) {
        setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setUserSortField(field);
        setUserSortDirection('asc');
      }
    }
  };

  const sortUsers = (usersToSort, sortField, sortDirection) => {
    return [...usersToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'joined':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'lastLogin':
          aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
          bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
          break;
        case 'transactions':
          aValue = a.transactionCount || 0;
          bValue = b.transactionCount || 0;
          break;
        case 'inactivityDays':
          aValue = calculateInactivityDays(a.lastActivity || a.lastLogin);
          bValue = calculateInactivityDays(b.lastActivity || b.lastLogin);
          break;
        case 'status':
          aValue = a.adminRequestPending ? 1 : 0;
          bValue = b.adminRequestPending ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const handleDeleteClick = (userToDelete) => {
    setUserToDelete(userToDelete);
    setConfirmText('');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (confirmText !== 'REMOVE') {
      toast.error('Please type "REMOVE" to confirm');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users/${userToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success(`User ${userToDelete.name} deleted successfully`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      setConfirmText('');
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderSortIcon = (field, tableType) => {
    const currentSortField = tableType === 'admin' ? adminSortField : userSortField;
    const currentSortDirection = tableType === 'admin' ? adminSortDirection : userSortDirection;

    if (currentSortField !== field) {
      return ' ⇅';
    }
    return currentSortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) {
    return (
      <div className="admin-users-page">
        <Container>
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading users...</p>
          </div>
        </Container>
      </div>
    );
  }

  const adminUsers = sortUsers(
    users.filter(u => u.role === 'admin'),
    adminSortField,
    adminSortDirection
  );

  const regularUsers = sortUsers(
    users.filter(u => u.role === 'user'),
    userSortField,
    userSortDirection
  );

  const inactiveUsers = regularUsers.filter(u => 
    calculateInactivityDays(u.lastActivity || u.lastLogin) > 30
  );

  return (
    <div className="admin-users-page">
      <Container>
        <div className="page-header">
          <div>
            <h1>👥 User Management</h1>
            <p>View and manage all registered users</p>
          </div>
          <Button variant="outline-secondary" onClick={() => navigate('/admin')}>
            ← Back to Dashboard
          </Button>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👑</div>
            <div className="stat-info">
              <h3>{adminUsers.length}</h3>
              <p>Admins</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{regularUsers.length}</h3>
              <p>Regular Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>{inactiveUsers.length}</h3>
              <p>Inactive 30+ Days</p>
            </div>
          </div>
        </div>

        {/* ADMIN USERS TABLE */}
        <div className="table-section" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <h2>👑 Admin Users ({adminUsers.length})</h2>
            <p>Users with administrative privileges</p>
          </div>

          {adminUsers.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h4>No Admin Users</h4>
              <p>There are no admin users in the system.</p>
            </Alert>
          ) : (
            <div className="users-table-container">
              <Table responsive hover className="users-table">
                <thead>
                  <tr>
                    <th 
                      onClick={() => handleSort('name', 'admin')}
                      style={{ cursor: 'pointer' }}
                    >
                      User{renderSortIcon('name', 'admin')}
                    </th>
                    <th 
                      onClick={() => handleSort('email', 'admin')}
                      style={{ cursor: 'pointer' }}
                    >
                      Email{renderSortIcon('email', 'admin')}
                    </th>
                    <th 
                      onClick={() => handleSort('joined', 'admin')}
                      style={{ cursor: 'pointer' }}
                    >
                      Joined{renderSortIcon('joined', 'admin')}
                    </th>
                    <th 
                      onClick={() => handleSort('lastLogin', 'admin')}
                      style={{ cursor: 'pointer' }}
                    >
                      Last Login{renderSortIcon('lastLogin', 'admin')}
                    </th>
                    <th 
                      onClick={() => handleSort('transactions', 'admin')}
                      style={{ cursor: 'pointer' }}
                    >
                      Transactions{renderSortIcon('transactions', 'admin')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((u) => (
                    <tr key={`admin-${u._id}`}>
                      <td>
                        <div className="user-cell">
                          <img
                            src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`}
                            alt={u.name}
                            className="user-avatar"
                          />
                          <div>
                            <strong>{u.name}</strong>
                            {u._id === user?.id && (
                              <Badge bg="secondary" className="ms-2">You</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>{formatDate(u.lastLogin)}</td>
                      <td className="text-center">
                        <Badge bg="info">{u.transactionCount || 0}</Badge>
                      </td>
                      <td>
                        {u._id !== user?.id ? (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(u)}
                          >
                            🗑️ Delete
                          </Button>
                        ) : (
                          <Button variant="outline-secondary" size="sm" disabled>
                            Can't delete self
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* REGULAR USERS TABLE */}
        <div className="table-section">
          <div className="section-header">
            <h2>👤 Regular Users ({regularUsers.length})</h2>
            <p>Standard user accounts</p>
          </div>

          {regularUsers.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h4>No Regular Users</h4>
              <p>There are no regular users in the system.</p>
            </Alert>
          ) : (
            <div className="users-table-container">
              <Table responsive hover className="users-table">
                <thead>
                  <tr>
                    <th 
                      onClick={() => handleSort('name', 'user')}
                      style={{ cursor: 'pointer' }}
                    >
                      User{renderSortIcon('name', 'user')}
                    </th>
                    <th 
                      onClick={() => handleSort('email', 'user')}
                      style={{ cursor: 'pointer' }}
                    >
                      Email{renderSortIcon('email', 'user')}
                    </th>
                    <th 
                      onClick={() => handleSort('status', 'user')}
                      style={{ cursor: 'pointer' }}
                    >
                      Status{renderSortIcon('status', 'user')}
                    </th>
                    <th 
                      onClick={() => handleSort('inactivityDays', 'user')}
                      style={{ cursor: 'pointer' }}
                    >
                      Inactive Days{renderSortIcon('inactivityDays', 'user')}
                    </th>
                    <th 
                      onClick={() => handleSort('joined', 'user')}
                      style={{ cursor: 'pointer' }}
                    >
                      Joined{renderSortIcon('joined', 'user')}
                    </th>
                    <th 
                      onClick={() => handleSort('lastLogin', 'user')}
                      style={{ cursor: 'pointer' }}
                    >
                      Last Login{renderSortIcon('lastLogin', 'user')}
                    </th>
                    <th 
                      onClick={() => handleSort('transactions', 'user')}
                      style={{ cursor: 'pointer' }}
                    >
                      Transactions{renderSortIcon('transactions', 'user')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regularUsers.map((u) => {
                    const inactiveDays = calculateInactivityDays(u.lastActivity || u.lastLogin);
                    const isInactive = inactiveDays > 30;
                    
                    return (
                      <tr key={`user-${u._id}`} className={isInactive ? 'inactive-user' : ''}>
                        <td>
                          <div className="user-cell">
                            <img
                              src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`}
                              alt={u.name}
                              className="user-avatar"
                            />
                            <div>
                              <strong>{u.name}</strong>
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          {u.adminRequestPending ? (
                            <Badge bg="warning" text="dark">⏳ Pending</Badge>
                          ) : isInactive ? (
                            <Badge bg="danger">⚠️ Inactive</Badge>
                          ) : (
                            <Badge bg="success">✓ Active</Badge>
                          )}
                        </td>
                        <td>
                          <span className={isInactive ? 'text-danger fw-bold' : ''}>
                            {inactiveDays} {inactiveDays === 1 ? 'day' : 'days'}
                            {isInactive && ' ⚠️'}
                          </span>
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
                        <td>{formatDate(u.lastLogin)}</td>
                        <td className="text-center">
                          <Badge bg="info">{u.transactionCount || 0}</Badge>
                        </td>
                        <td>
                          <Button
                            variant={isInactive ? "danger" : "outline-danger"}
                            size="sm"
                            onClick={() => handleDeleteClick(u)}
                          >
                            🗑️ Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {inactiveUsers.length > 0 && (
          <Alert variant="warning" className="mt-4">
            <strong>⚠️ Notice:</strong> {inactiveUsers.length} user(s) have been inactive for more than 30 days 
            and may be eligible for account deletion according to the Terms and Conditions.
          </Alert>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Delete User Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>Warning:</strong> This action cannot be undone!
          </Alert>
          
          <p>You are about to permanently delete:</p>
          <div className="user-to-delete-info">
            <strong>Name:</strong> {userToDelete?.name}<br />
            <strong>Email:</strong> {userToDelete?.email}<br />
            <strong>Role:</strong> {userToDelete?.role}<br />
            <strong>Transactions:</strong> {userToDelete?.transactionCount || 0}<br />
            <strong>Inactive Days:</strong> {calculateInactivityDays(userToDelete?.lastActivity || userToDelete?.lastLogin)} days
          </div>

          <p className="mt-3">This will delete:</p>
          <ul>
            <li>User account</li>
            <li>All {userToDelete?.transactionCount || 0} transactions</li>
            <li>All associated data</li>
          </ul>

          <div className="alert alert-info mt-3">
            <strong>📋 Ethical Notice:</strong> User data will be permanently removed in compliance 
            with data privacy policies and the inactivity terms accepted during registration.
          </div>

          <Form.Group className="mt-4">
            <Form.Label>
              Type <strong>REMOVE</strong> (in capitals) to confirm:
            </Form.Label>
            <Form.Control
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type REMOVE"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={confirmText !== 'REMOVE'}
          >
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;
