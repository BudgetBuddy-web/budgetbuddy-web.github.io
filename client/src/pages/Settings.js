/**
 * Settings Page
 * User profile and app settings
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Settings.css';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    profilePic: user?.profilePic || ''
  });
  const [savingsGoal, setSavingsGoal] = useState(user?.savingsGoal || 5000);
  const [settings, setSettings] = useState({
    assistantPersonality: user?.assistantPersonality || 'cheerful',
    theme: user?.theme || 'light'
  });
  const [loading, setLoading] = useState({
    profile: false,
    savings: false,
    settings: false
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });

    try {
      const response = await userAPI.updateProfile(profileData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handleSavingsUpdate = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, savings: true });

    try {
      await userAPI.updateBudget({ savingsGoal });
      updateUser({ savingsGoal });
      toast.success('Savings goal updated successfully');
    } catch (error) {
      toast.error('Failed to update savings goal');
      console.error(error);
    } finally {
      setLoading({ ...loading, savings: false });
    }
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, settings: true });

    try {
      await userAPI.updateSettings(settings);
      updateUser(settings);
      
      // Apply theme immediately
      setTheme(settings.theme);
      
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    } finally {
      setLoading({ ...loading, settings: false });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ Are you absolutely sure you want to delete your account?\n\n' +
      'This will permanently delete:\n' +
      '• All your transactions\n' +
      '• Your profile and settings\n' +
      '• All financial data and reports\n\n' +
      'This action CANNOT be undone!'
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" (in capitals) to confirm account deletion:'
    );

    if (doubleConfirm !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    try {
      await userAPI.deleteAccount();
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to delete account');
      console.error(error);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your profile and app preferences</p>
      </div>

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="card">
          <h2 className="section-title">👤 Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={user?.email}
                className="form-control"
                disabled
              />
              <small className="form-text">Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Picture URL</label>
              <input
                type="url"
                value={profileData.profilePic}
                onChange={(e) => setProfileData({ ...profileData, profilePic: e.target.value })}
                className="form-control"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="profile-preview">
              <img 
                src={profileData.profilePic} 
                alt="Profile" 
                className="preview-image"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=User&background=random';
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading.profile}
            >
              {loading.profile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Savings Settings */}
        <div className="card">
          <h2 className="section-title">🎯 Savings Goal</h2>
          <form onSubmit={handleSavingsUpdate}>
            <div className="form-group">
              <label className="form-label">Monthly Savings Goal (₹)</label>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(parseFloat(e.target.value))}
                className="form-control"
                min="0"
                step="100"
                required
              />
              <small className="form-text">
                Set your monthly savings target (recommended: 20-50% of income)
              </small>
            </div>

            <div className="budget-info">
              <div className="info-item">
                <span className="info-label">Current Goal:</span>
                <span className="info-value">₹{user?.savingsGoal?.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">New Goal:</span>
                <span className="info-value">₹{savingsGoal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading.savings}
            >
              {loading.savings ? 'Updating...' : 'Update Savings Goal'}
            </button>
          </form>
        </div>

        {/* App Settings */}
        <div className="card">
          <h2 className="section-title">⚙️ App Preferences</h2>
          <form onSubmit={handleSettingsUpdate}>
            <div className="form-group">
              <label className="form-label">Assistant Personality</label>
              <select
                value={settings.assistantPersonality}
                onChange={(e) => setSettings({ ...settings, assistantPersonality: e.target.value })}
                className="form-select"
              >
                <option value="cheerful">😊 Cheerful - Enthusiastic and energetic</option>
                <option value="calm">😌 Calm - Balanced and encouraging</option>
                <option value="strict">😐 Strict - Direct and goal-focused</option>
              </select>
              <small className="form-text">
                Choose how your anime assistant interacts with you
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => {
                  const newTheme = e.target.value;
                  setSettings({ ...settings, theme: newTheme });
                  // Apply theme instantly for preview
                  setTheme(newTheme);
                }}
                className="form-select"
              >
                <option value="light">☀️ Light Theme</option>
                <option value="dark">🌙 Dark Theme</option>
                <option value="auto">🔄 Auto (System)</option>
              </select>
              <small className="form-text">
                Select your preferred color scheme (changes instantly!)
              </small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading.settings}
            >
              {loading.settings ? 'Updating...' : 'Update Settings'}
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="card danger-zone">
          <h2 className="section-title">�️ Delete Account</h2>
          <p className="warning-text">
            ⚠️ Warning: This action cannot be undone. Deleting your account will permanently remove:
          </p>
          <ul className="warning-list">
            <li>All your transactions</li>
            <li>Your profile and settings</li>
            <li>All financial data and reports</li>
          </ul>
          <button 
            className="btn btn-danger"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
