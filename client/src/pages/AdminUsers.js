/**
 * Admin Users Management Page
 * View and manage all users
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              <h3>{users.filter(u => u.role === 'admin').length}</h3>
              <p>Admins</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{users.filter(u => u.role === 'user').length}</h3>
              <p>Regular Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{users.filter(u => u.adminRequestPending).length}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <Alert variant="info" className="text-center">
            <h4>No Users Found</h4>
            <p>There are no registered users in the system.</p>
          </Alert>
        ) : (
          <div className="users-table-container">
            <Table responsive hover className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Transactions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <img
                          src={u.profilePic || `https://ui-avatars.com/api/?name=${u.name}&background=random`}
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
                    <td>
                      <Badge bg={u.role === 'admin' ? 'danger' : 'primary'}>
                        {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </Badge>
                    </td>
                    <td>
                      {u.adminRequestPending ? (
                        <Badge bg="warning" text="dark">⏳ Pending</Badge>
                      ) : (
                        <Badge bg="success">✓ Active</Badge>
                      )}
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>{u.lastLogin ? formatDate(u.lastLogin) : 'Never'}</td>
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
            <strong>Transactions:</strong> {userToDelete?.transactionCount || 0}
          </div>

          <p className="mt-3">This will delete:</p>
          <ul>
            <li>User account</li>
            <li>All {userToDelete?.transactionCount || 0} transactions</li>
            <li>All associated data</li>
          </ul>

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
