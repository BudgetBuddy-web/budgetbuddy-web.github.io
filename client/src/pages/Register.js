/**
 * Register Page
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
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
    confirmPassword: '',
    requestAdminRole: false
  });
  const [loading, setLoading] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        requestAdminRole: formData.requestAdminRole
      });
      
      if (formData.requestAdminRole) {
        toast.success('Account created! Admin request sent for approval.');
      } else {
        toast.success('Registration successful!');
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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

          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                name="requestAdminRole"
                id="requestAdminRole"
                checked={formData.requestAdminRole}
                onChange={(e) => setFormData(prev => ({ ...prev, requestAdminRole: e.target.checked }))}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="requestAdminRole">
                Request Admin Access (Requires approval from existing admins)
              </label>
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
      
      {/* Footer */}
      <footer className="app-footer">
        <p>Created by <strong>DAVID OLIVER J</strong> | URK23CS1305</p>
      </footer>
    </div>
  );
};

export default Register;
