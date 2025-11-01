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
  const [useNameAvatar, setUseNameAvatar] = useState(
    !user?.profilePic || user?.profilePic.includes('ui-avatars.com')
  );
  const [savingsGoal, setSavingsGoal] = useState(user?.savingsGoal || 5000);
  const [allTimeGoal, setAllTimeGoal] = useState(user?.allTimeGoal || 20000);
  const [settings, setSettings] = useState({
    assistantPersonality: user?.assistantPersonality || 'cheerful',
    theme: user?.theme || 'light'
  });
  const [loading, setLoading] = useState({
    profile: false,
    savings: false,
    settings: false
  });

  const handleSavingsGoalChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 7 digits before decimal point
    if (parts[0] && parts[0].length > 7) {
      value = parts[0].slice(0, 7) + (parts[1] ? '.' + parts[1] : '');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    setSavingsGoal(value === '' ? '' : parseFloat(value) || 0);
  };

  const handleAllTimeGoalChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 7 digits before decimal point
    if (parts[0] && parts[0].length > 7) {
      value = parts[0].slice(0, 7) + (parts[1] ? '.' + parts[1] : '');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    setAllTimeGoal(value === '' ? '' : parseFloat(value) || 0);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });

    try {
      // Generate avatar URL if using name avatar
      const updatedProfileData = {
        ...profileData,
        profilePic: useNameAvatar 
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random&size=200`
          : profileData.profilePic
      };

      const response = await userAPI.updateProfile(updatedProfileData);
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
    
    // Validate savings goal
    if (isNaN(savingsGoal) || savingsGoal <= 0) {
      toast.error('Please enter a valid monthly savings goal greater than 0');
      return;
    }
    
    if (savingsGoal > 9999999.99) {
      toast.error('Monthly savings goal cannot exceed 9,999,999.99');
      return;
    }

    // Validate all-time goal
    if (isNaN(allTimeGoal) || allTimeGoal <= 0) {
      toast.error('Please enter a valid all-time goal greater than 0');
      return;
    }
    
    if (allTimeGoal > 9999999.99) {
      toast.error('All-time goal cannot exceed 9,999,999.99');
      return;
    }
    
    setLoading({ ...loading, savings: true });

    try {
      await userAPI.updateBudget({ savingsGoal, allTimeGoal });
      updateUser({ savingsGoal, allTimeGoal });
      toast.success('Savings goals updated successfully');
    } catch (error) {
      toast.error('Failed to update savings goals');
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
              <label className="form-label">Profile Picture</label>
              <div className="avatar-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="avatarType"
                    checked={useNameAvatar}
                    onChange={() => setUseNameAvatar(true)}
                  />
                  <span>Use name initials (auto-generated)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="avatarType"
                    checked={!useNameAvatar}
                    onChange={() => setUseNameAvatar(false)}
                  />
                  <span>Use custom image URL</span>
                </label>
              </div>
            </div>

            {!useNameAvatar && (
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
            )}

            <div className="profile-preview">
              <img 
                src={
                  useNameAvatar 
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=random&size=200`
                    : profileData.profilePic
                } 
                alt="Profile" 
                className="preview-image"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=User&background=random&size=200';
                }}
              />
              <small className="form-text">
                {useNameAvatar ? 'Auto-generated from your name' : 'Preview of your profile picture'}
              </small>
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
          <h2 className="section-title">🎯 Savings Goals</h2>
          <form onSubmit={handleSavingsUpdate}>
            <div className="form-group">
              <label className="form-label">Monthly Savings Goal (₹)</label>
              <input
                type="text"
                value={savingsGoal}
                onChange={handleSavingsGoalChange}
                className="form-control"
                required
                inputMode="decimal"
              />
              <small className="form-text">
                Set your monthly savings target (recommended: 20-50% of income). Max: 9,999,999.99
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">All Time Savings Goal (₹)</label>
              <input
                type="text"
                value={allTimeGoal}
                onChange={handleAllTimeGoalChange}
                className="form-control"
                required
                inputMode="decimal"
              />
              <small className="form-text">
                Set your overall long-term savings target. Max: 9,999,999.99
              </small>
            </div>

            <div className="budget-info">
              <div className="info-item">
                <span className="info-label">Current Monthly Goal:</span>
                <span className="info-value">₹{user?.savingsGoal?.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">New Monthly Goal:</span>
                <span className="info-value">₹{savingsGoal.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Current All Time Goal:</span>
                <span className="info-value">₹{user?.allTimeGoal?.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">New All Time Goal:</span>
                <span className="info-value">₹{allTimeGoal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading.savings}
            >
              {loading.savings ? 'Updating...' : 'Update Savings Goals'}
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
