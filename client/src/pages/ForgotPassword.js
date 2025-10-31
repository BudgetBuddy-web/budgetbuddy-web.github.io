/**
 * Forgot Password Page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AnimeAssistant from '../components/AnimeAssistant';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate password reset email (in real app, would call API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
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
          {!emailSent && (
            <div className="demo-notice">
              ℹ️ <strong>Demo Note:</strong> Email sending is simulated. In production, you would receive a real email.
            </div>
          )}
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
            <h3>Email Sent! (Simulated)</h3>
            <p>
              In a production app, a reset link would be sent to <strong>{email}</strong>
            </p>
            <p className="note">
              <strong>⚠️ Demo Mode:</strong> This is a demonstration. No actual email was sent. 
              To enable real emails, see FORGOT_PASSWORD_SETUP.md for configuration instructions.
            </p>
            <button 
              onClick={() => setEmailSent(false)} 
              className="btn btn-secondary btn-block"
            >
              Try Again
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
