# Assistant Reactions Based on Monthly Savings

## Overview
Modified the assistant's (Akari's) reactions to always be based on the **current month's savings rate**, regardless of whether the user is viewing "This Month" or "All Time" data in the dashboard.

## Previous Behavior
- When viewing "This Month" → Assistant reacted to monthly savings rate ✅
- When viewing "All Time" → Assistant reacted to all-time savings rate ❌

This was confusing because the progress bar shown is for monthly savings, but the assistant's reaction changed based on the view mode.

## New Behavior
- When viewing "This Month" → Assistant reacts to monthly savings rate ✅
- When viewing "All Time" → Assistant reacts to monthly savings rate ✅

Now the assistant's reactions are **always consistent** with the monthly savings progress bar that's displayed.

## Technical Changes

### Dashboard.js

#### 1. Added Monthly Savings Rate State
```javascript
const [monthlySavingsRate, setMonthlySavingsRate] = useState(0); // For assistant reactions
```

#### 2. Modified Trigger Reactions Function
Changed from using `summary.summary` (which varies by view mode) to using the dedicated `monthlySavingsRate` state:

**Before:**
```javascript
const triggerReactions = useCallback(() => {
  if (summary && summary.summary) {
    const totalIncome = Number(summary.summary.totalIncome) || 0;
    const totalExpenses = Number(summary.summary.totalExpenses) || 0;
    const savings = totalIncome - totalExpenses;
    const savingsRatePercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    // reactions based on this rate...
  }
}, [summary, celebrate, encourage, idle, worry]);
```

**After:**
```javascript
const triggerReactions = useCallback(() => {
  // Always use monthly savings rate for reactions
  const savingsRatePercentage = monthlySavingsRate;
  // reactions based on this rate...
}, [monthlySavingsRate, celebrate, encourage, idle, worry]);
```

#### 3. Calculate Current Month Savings in loadDashboardData
Added logic to **always** calculate the current month's savings rate, regardless of view mode:

```javascript
// ALWAYS calculate current month's savings rate for assistant reactions
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

const currentMonthTransactions = allTransactions.filter(t => {
  const transactionDate = new Date(t.date);
  return transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd;
});

const currentMonthIncome = currentMonthTransactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0);

const currentMonthExpenses = currentMonthTransactions
  .filter(t => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0);

const currentMonthSavings = currentMonthIncome - currentMonthExpenses;
const currentMonthSavingsRate = currentMonthIncome > 0 
  ? (currentMonthSavings / currentMonthIncome) * 100 
  : 0;

// Set monthly savings rate for assistant reactions
setMonthlySavingsRate(currentMonthSavingsRate);
```

## Reaction Thresholds
The assistant reacts based on monthly savings rate (percentage of income saved):

| Savings Rate | Reaction | Animation |
|-------------|----------|-----------|
| ≥ 60% | Celebrate! 🎉 | celebrate() |
| 40-59% | Steady/Idle 😌 | idle() |
| 20-39% | Encourage 💪 | encourage() |
| 5-19% | Worry 😟 | worry() |
| < 5% | Worry More 😰 | worry() |

## User Experience

### Scenario 1: User in "This Month" View
- Dashboard shows: November 2025 data
- Progress bar shows: November savings (₹9,800 / ₹20,000 goal)
- Savings rate: 32.7% of income
- **Assistant reaction**: Encourage (20-39% range) ✅

### Scenario 2: User Switches to "All Time" View
- Dashboard shows: All-time data (₹30,000 income, ₹20,200 expenses)
- Progress bar shows: Still showing monthly goal progress
- Savings rate (monthly): Still 32.7%
- **Assistant reaction**: Still Encourage (consistent!) ✅

### Scenario 3: User Changes Month Selection (e.g., October)
- Dashboard shows: October 2025 data
- Progress bar shows: October savings vs goal
- **Assistant reaction**: Still based on **current month (November)**, not October ⚠️

This is intentional - the assistant always reacts to the actual current month to encourage real-time good habits.

## Benefits
1. **Consistency**: Assistant reactions match the visible progress bar
2. **Relevance**: Reactions based on current month encourage good habits now
3. **No Confusion**: Users don't see different reactions when switching views
4. **Realistic Goals**: Monthly savings is more actionable than all-time totals

## Files Modified
- `/client/src/pages/Dashboard.js`
  - Added `monthlySavingsRate` state
  - Modified `triggerReactions()` to use fixed monthly rate
  - Added current month calculation in `loadDashboardData()`

## Testing
✅ Switch to "All Time" view → Assistant still reacts to monthly savings
✅ Add transaction → Assistant updates reaction based on new monthly rate
✅ Change month selector → Assistant still reacts to current month (November)
✅ Progress bar and assistant reactions are now always in sync
