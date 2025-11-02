/**
 * Admin Requests Page
 * View and manage pending admin access requests
 */

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminRequests.css';

const AdminRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [processing, setProcessing] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch admin requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(response.data.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load admin requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to approve ${userName} as admin?`)) {
      return;
    }

    try {
      setProcessing(userId);
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/requests/${userId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`✅ ${userName} has been promoted to admin!`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to reject ${userName}'s admin request?`)) {
      return;
    }

    try {
      setProcessing(userId);
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/requests/${userId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`❌ ${userName}'s request has been rejected`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="admin-requests mt-5">
        <div className="text-center">
          <div className="spinner-border text-purple" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading admin requests...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="admin-requests" fluid>
      <div className="requests-header">
        <div>
          <h1>👑 Admin Access Requests</h1>
          <p className="text-muted">Review and approve admin access requests</p>
        </div>
        <Button variant="outline-primary" onClick={() => navigate('/admin')}>
          ← Back to Dashboard
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card className="no-requests-card">
          <Card.Body className="text-center py-5">
            <div className="empty-icon">✓</div>
            <h3>No Pending Requests</h3>
            <p className="text-muted">
              There are currently no pending admin access requests.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="requests-card">
          <Card.Header>
            <h5>
              📋 Pending Requests 
              <Badge bg="warning" className="ms-2">{requests.length}</Badge>
            </h5>
          </Card.Header>
          <Card.Body>
            <Table responsive hover className="requests-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Requested On</th>
                  <th>Current Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={request._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="user-info">
                        <img 
                          src={request.profilePic} 
                          alt={request.name}
                          className="user-avatar"
                        />
                        <strong>{request.name}</strong>
                      </div>
                    </td>
                    <td>{request.email}</td>
                    <td>{formatDate(request.adminRequestedAt)}</td>
                    <td>
                      <Badge bg="secondary">User</Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApprove(request._id, request.name)}
                          disabled={processing === request._id}
                        >
                          {processing === request._id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1"></span>
                              Processing...
                            </>
                          ) : (
                            <>✓ Approve</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(request._id, request.name)}
                          disabled={processing === request._id}
                          className="ms-2"
                        >
                          ✗ Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Alert variant="info" className="mt-4">
        <Alert.Heading>ℹ️ About Admin Requests</Alert.Heading>
        <p className="mb-0">
          When users register and check "Request Admin Access", their request appears here. 
          As an admin, you can approve or reject these requests. Approved users will be promoted 
          to admin role and gain access to all admin features.
        </p>
      </Alert>
    </Container>
  );
};

export default AdminRequests;
