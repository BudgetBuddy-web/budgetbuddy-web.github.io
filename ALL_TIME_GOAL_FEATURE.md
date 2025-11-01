# All Time Goal Feature

## Overview
Added a separate "All Time Savings Goal" setting that allows users to set long-term savings targets in addition to their monthly goals.

## Changes Made

### 1. User Model (`server/models/User.model.js`)
- Added `allTimeGoal` field (default: 20000)
- Stores the user's long-term savings target

### 2. Settings Page (`client/src/pages/Settings.js`)
- Added "All Time Savings Goal" input field
- Added `allTimeGoal` state management
- Added `handleAllTimeGoalChange()` function with validation (same as monthly goal)
- Updated `handleSavingsUpdate()` to save both goals
- Updated UI to show:
  - Current Monthly Goal / New Monthly Goal
  - Current All Time Goal / New All Time Goal
- Changed section title from "🎯 Savings Goal" to "🎯 Savings Goals" (plural)

### 3. Dashboard (`client/src/pages/Dashboard.js`)
- Updated "All Time" view mode to use `user?.allTimeGoal` instead of `user?.savingsGoal`
- This ensures the correct goal is compared when viewing all-time data

### 4. Insights Styling (`client/src/pages/Dashboard.css`)
- Fixed text clustering issue in insights section
- Added CSS properties:
  - `word-wrap: break-word`
  - `overflow-wrap: break-word`
  - `word-break: break-word`
  - `line-height: 1.6`
- Prevents long text from overflowing and ensures proper text wrapping

## Features

### Monthly Savings Goal
- Used when viewing "This Month" data in Dashboard
- Tracked monthly against current month's savings
- Recommended: 20-50% of monthly income

### All Time Savings Goal
- Used when viewing "All Time" data in Dashboard
- Tracks overall long-term savings target
- Helps users set and achieve bigger financial goals

### Validation
Both goals have the same validation:
- Must be greater than 0
- Cannot exceed 9,999,999.99
- Limited to 7 digits before decimal point
- Limited to 2 decimal places
- Text input with custom validation (no 'e' or scientific notation)

## User Experience
1. Navigate to Settings page
2. Set both Monthly and All Time goals
3. Click "Update Savings Goals" to save
4. In Dashboard:
   - "This Month" view uses Monthly Goal for insights
   - "All Time" view uses All Time Goal for insights
5. Insights text now properly wraps without clustering/overlapping

## Technical Details
- Backend automatically stores both goals in user profile
- Frontend validates input client-side before submission
- Server validates on backend as well
- CSS ensures proper text display on all screen sizes
