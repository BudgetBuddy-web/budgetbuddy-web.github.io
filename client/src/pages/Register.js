/**
 * Register Page
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useAssistant } from '../contexts/AssistantContext';
import { toast } from 'react-toastify';
import AnimeAssistant from '../components/AnimeAssistant';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { coverEyes, react } = useAssistant();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Welcome message when component mounts
  useEffect(() => {
    react('excited', '🎉 Create an account to start tracking your budget!');
  }, [react]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if ((name === 'password' || name === 'confirmPassword') && value) {
      if (!isTypingPassword) {
        setIsTypingPassword(true);
        coverEyes();
      }
    } else if (name === 'password' && !value) {
      setIsTypingPassword(false);
      react('happy', 'Let\'s create your account! 🎉');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show terms and conditions modal first
    if (!acceptedTerms) {
      setShowTermsModal(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        acceptedTerms: true
      });
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setShowTermsModal(false);
    toast.success('Terms accepted! Now completing registration...');
    // Re-trigger form submission
    setTimeout(() => {
      const form = document.querySelector('.auth-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }, 100);
  };

  const handleDeclineTerms = () => {
    setShowTermsModal(false);
    setAcceptedTerms(false);
    toast.info('You must accept the terms to register');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>💰 BudgetBuddy</h1>
          <p>Create your account and start managing your finances</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>

      {/* Anime Assistant */}
      <AnimeAssistant />
      
      {/* Terms and Conditions Modal */}
      <Modal 
        show={showTermsModal} 
        onHide={handleDeclineTerms}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>📋 Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <h5>Account Inactivity Policy</h5>
          <p>Please read and accept the following terms before registering:</p>
          
          <div className="alert alert-warning">
            <strong>⚠️ Important: Account Deletion Policy</strong>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '15px' }}>
            <h6>1. Inactivity Period</h6>
            <p>Your account will be considered <strong>inactive</strong> if you do not log in for <strong>30 consecutive days</strong>.</p>

            <h6>2. Account Deletion</h6>
            <p>Accounts that remain inactive for more than 30 days may be permanently deleted by administrators to maintain system efficiency and data hygiene.</p>

            <h6>3. Data Deletion</h6>
            <p>When an inactive account is deleted, the following data will be permanently removed:</p>
            <ul>
              <li>Your user profile and account information</li>
              <li>All transactions and financial records</li>
              <li>Budget goals and settings</li>
              <li>All associated data</li>
            </ul>

            <h6>4. Notification</h6>
            <p>We recommend logging in regularly to keep your account active. There is no automatic notification before deletion.</p>

            <h6>5. Ethical Data Management</h6>
            <p>This policy ensures that we maintain user privacy and do not retain unused personal data indefinitely.</p>
          </div>

          <div className="alert alert-info">
            <strong>💡 Tip:</strong> Simply log in once every 30 days to keep your account active!
          </div>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            By clicking "I Accept", you acknowledge that you have read and understood this policy, 
            and you agree to these terms and conditions.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeclineTerms}>
            ❌ Decline
          </Button>
          <Button variant="primary" onClick={handleAcceptTerms}>
            ✅ I Accept
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Footer */}
      <footer className="app-footer">
        <p>Created by <strong>DAVID OLIVER J</strong> | URK23CS1305</p>
      </footer>
    </div>
  );
};

export default Register;
