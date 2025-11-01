/**
 * Assistant Context
 * Manages anime assistant state and animations
 */

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AssistantContext = createContext();

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
};

export const AssistantProvider = ({ children }) => {
  const { user } = useAuth();
  const [mood, setMood] = useState('happy'); // happy, sad, shocked, excited, thinking
  const [message, setMessage] = useState('Welcome to BudgetBuddy! 💰');
  const [isVisible, setIsVisible] = useState(true);
  const [monthlyGoalProgress, setMonthlyGoalProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate monthly goal progress from transactions and set message
  const calculateProgress = useCallback(async () => {
    if (!user || isCalculating) return;
    
    try {
      setIsCalculating(true);
      const transactionsRes = await transactionAPI.getAll();
      const allTransactions = transactionsRes.data;
      
      // Calculate current month's progress
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
      const monthlySavingsGoal = user?.savingsGoal || 5000;
      
      // Calculate goal progress percentage
      const goalProgress = monthlySavingsGoal > 0 
        ? (currentMonthSavings / monthlySavingsGoal) * 100 
        : 0;
      
      console.log('🎯 Assistant Context - Progress Calculated:');
      console.log('  - Current Month Savings:', currentMonthSavings);
      console.log('  - Monthly Savings Goal:', monthlySavingsGoal);
      console.log('  - Goal Progress:', goalProgress.toFixed(2) + '%');
      
      setMonthlyGoalProgress(goalProgress);
      
      // Set message based on progress and trigger expression based on message keywords
      let newMessage = '';
      let newMood = 'happy';
      
      if (goalProgress >= 100) {
        newMessage = `🎉 Amazing! ${goalProgress.toFixed(1)}% - You're exceeding your goals!`;
        newMood = 'excited';
      } else if (goalProgress >= 75) {
        newMessage = `💖 Excellent! ${goalProgress.toFixed(1)}% - Keep up the great work!`;
        newMood = 'excited';
      } else if (goalProgress >= 50) {
        newMessage = `😊 Good job! ${goalProgress.toFixed(1)}% - You're doing well!`;
        newMood = 'idle';
      } else if (goalProgress >= 25) {
        newMessage = `💪 Keep going! ${goalProgress.toFixed(1)}% - You can do this!`;
        newMood = 'happy';
      } else if (goalProgress >= 10) {
        newMessage = `😟 Careful! ${goalProgress.toFixed(1)}% - Watch your spending...`;
        newMood = 'sad';
      } else {
        newMessage = `😢 Oh no! ${goalProgress.toFixed(1)}% - Please save more!`;
        newMood = 'sad';
      }
      
      setProgressMessage(newMessage);
      setMessage(newMessage);
      setMood(newMood);
      
      console.log('💬 Message set:', newMessage);
      console.log('🎭 Mood set:', newMood);
      
    } catch (error) {
      console.error('Error calculating progress:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [user]); // Remove isCalculating from dependencies to prevent infinite loop

  // Calculate progress when user logs in or changes
  useEffect(() => {
    if (user) {
      // Delay to ensure data is loaded
      const timer = setTimeout(() => {
        calculateProgress();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [user]); // Remove calculateProgress from dependencies to prevent infinite loop

  // Set assistant mood and message
  const react = useCallback((newMood, newMessage) => {
    setMood(newMood);
    if (newMessage) {
      setMessage(newMessage);
    }
  }, []);

  // Predefined reactions
  const celebrate = useCallback(() => {
    react('excited', '🎉 Amazing! You\'re doing great!');
  }, [react]);

  const worry = useCallback(() => {
    react('sad', '😟 Careful with your spending...');
  }, [react]);

  const shock = useCallback(() => {
    react('shocked', '😱 Whoa! That\'s a big expense!');
  }, [react]);

  const encourage = useCallback(() => {
    react('happy', '💪 Keep up the good work!');
  }, [react]);

  const idle = useCallback(() => {
    react('idle', '😊 Looking good! Keep it steady.');
  }, [react]);

  const think = useCallback(() => {
    react('thinking', '🤔 Let me calculate that...');
  }, [react]);

  const coverEyes = useCallback(() => {
    react('shy', '🙈 I won\'t peek!');
  }, [react]);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  // Refresh progress (called after transaction changes)
  const refreshProgress = useCallback(() => {
    console.log('🔄 Refreshing assistant progress...');
    calculateProgress();
  }, [calculateProgress]);

  const value = {
    mood,
    message,
    isVisible,
    monthlyGoalProgress,
    progressMessage,
    setMood,
    setMessage,
    react,
    celebrate,
    worry,
    shock,
    encourage,
    idle,
    think,
    coverEyes,
    toggleVisibility,
    refreshProgress,
    calculateProgress
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};
