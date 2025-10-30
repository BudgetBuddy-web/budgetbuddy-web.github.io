/**
 * Assistant Context
 * Manages anime assistant state and animations
 */

import React, { createContext, useState, useContext, useCallback } from 'react';

const AssistantContext = createContext();

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
};

export const AssistantProvider = ({ children }) => {
  const [mood, setMood] = useState('happy'); // happy, sad, shocked, excited, thinking
  const [message, setMessage] = useState('Welcome to BudgetBuddy! 💰');
  const [isVisible, setIsVisible] = useState(true);

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

  const value = {
    mood,
    message,
    isVisible,
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
    toggleVisibility
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};
