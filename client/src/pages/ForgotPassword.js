/**
 * Forgot Password Page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AnimeAssistant from '../components/AnimeAssistant';
import './Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      setEmailSent(true);
      toast.success(response.data.message || 'Password reset email sent!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🔐 Forgot Password</h1>
          <p>
            {emailSent 
              ? 'Check your email for reset instructions' 
              : 'Enter your email to reset your password'}
          </p>
        </div>

        {!emailSent ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✉️</div>
            <h3>Email Sent!</h3>
            <p>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="note">
              Please check your inbox and spam folder. The link will expire in 1 hour.
            </p>
            <button 
              onClick={() => setEmailSent(false)} 
              className="btn btn-secondary btn-block"
            >
              Send Another Email
            </button>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>

      {/* Anime Assistant */}
      <AnimeAssistant />
      
      {/* Footer */}
      <footer className="app-footer">
        <p>Created by <strong>DAVID OLIVER J</strong> | URK23CS1305</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
