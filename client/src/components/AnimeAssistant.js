/**
 * Anime Assistant Component
 * Live2D Akari character that reacts to user actions
 * Optimized with lazy loading and performance improvements
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import './AnimeAssistant.css';

// Lazy load PIXI and Live2D only when needed
let PIXI = null;
let Live2DModel = null;

const loadLive2DLibraries = async () => {
  if (PIXI && Live2DModel) return { PIXI, Live2DModel };
  
  // Dynamic import to reduce initial bundle
  const pixiModule = await import('pixi.js');
  const live2dModule = await import('pixi-live2d-display');
  
  PIXI = pixiModule;
  Live2DModel = live2dModule.Live2DModel;
  
  // Expose PIXI to window for Live2D
  if (typeof window !== 'undefined') {
    window.PIXI = pixiModule;
  }
  
  // Configure Live2D
  Live2DModel.registerTicker(pixiModule.Ticker);
  
  return { PIXI, Live2DModel };
};

const AnimeAssistant = () => {
  const { mood, message, isVisible, toggleVisibility, setMessage } = useAssistant();
  const canvasRef = useRef(null);
  const messageRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Click tracking state
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  // Initialize Live2D model with lazy loading
  useEffect(() => {
    // Only initialize once - don't reinitialize on visibility changes
    if (!canvasRef.current || appRef.current) return;

    const initModel = async () => {
      try {
        setIsLoading(true);
        console.log('🎭 Starting Live2D model initialization...');
        
        // Lazy load libraries
        const { PIXI: PixiJS, Live2DModel: Live2D } = await loadLive2DLibraries();
        
        // Check if Live2D core is loaded
        if (!window.Live2DCubismCore) {
          throw new Error('Live2D Cubism Core not loaded. Please refresh the page.');
        }

        // Create Pixi Application with optimized settings
        const app = new PixiJS.Application({
          view: canvasRef.current,
          width: 300,
          height: 400,
          backgroundColor: 0x000000,
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2), // Cap at 2x for performance
          eventMode: 'none',  // Disable events to prevent compatibility issues
        });

        // Disable the event system entirely
        if (app.renderer.events) {
          app.renderer.events.destroy();
        }

        appRef.current = app;

        // Load Live2D model with optimized settings
        const model = await Live2D.from('/akari_vts/akari.model3.json', {
          autoInteract: false,  // Disable auto-interaction (causes errors in PixiJS 7)
          autoUpdate: true,
        });

        modelRef.current = model;

        // Scale and position the model - SMALLER character inside SAME box
        const scale = 0.10;  // Much smaller scale to unzoom the girl
        model.scale.set(scale);
        
        // Use top anchor to position from the head down
        model.anchor.set(0.5, 0);  // Anchor at TOP center (not middle)
        model.x = 170;  // Center X (canvas width / 2 = 300/2)
        model.y = -100;  // Adjusted for smaller character

        // Add model to stage
        app.stage.addChild(model);

        setModelLoaded(true);
        setIsLoading(false);
        console.log('✅ Akari Live2D model loaded successfully!');

        // Note: Manual interaction disabled due to PixiJS 7 compatibility
        // The model will still animate and show expressions based on mood

      } catch (error) {
        console.error('❌ Error loading Live2D model:', error);
        setModelLoaded(false);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    // Add small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initModel();
    }, 100);

    // Cleanup only on component unmount, not on visibility change
    return () => {
      clearTimeout(timer);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
        modelRef.current = null;
        setModelLoaded(false);
      }
    };
  }, []); // Only run once on mount

  // Play specific motion by name
  const playMotion = useCallback((motionName) => {
    if (modelRef.current && modelRef.current.internalModel) {
      try {
        // Try playing the motion (Live2D will look it up in the model3.json)
        modelRef.current.motion(motionName);
      } catch (error) {
        // Silent fail - motion not found
      }
    }
  }, []);

  // Play expression based on mood
  const playExpression = useCallback((expressionName) => {
    if (modelRef.current && modelRef.current.internalModel) {
      try {
        modelRef.current.expression(expressionName);
      } catch (error) {
        // Silent fail - expression not found
      }
    }
  }, []);

  // Play combined reaction (expression + motion)
  const playReaction = useCallback((expressionName, motionName) => {
    if (expressionName) playExpression(expressionName);
    if (motionName) playMotion(motionName);
  }, [playExpression, playMotion]);

  // React to mood changes
  useEffect(() => {
    if (!modelLoaded || !modelRef.current) return;

    // Map moods to expressions AND animations
    const reactionMap = {
      'happy': { 
        expression: null, 
        motion: null 
      },
      'idle': { 
        expression: null, 
        motion: 'Idle' 
      },
      'excited': { 
        expression: 'EyesLove', 
        motion: 'Love' 
      },
      'sad': { 
        expression: 'EyesCry', 
        motion: 'Shock'  // Use shock animation for dramatic sad reaction
      },
      'shocked': { 
        expression: 'SignShock', 
        motion: 'Shock' 
      },
      'thinking': { 
        expression: 'SignAngry', 
        motion: null 
      },
      'shy': { 
        expression: 'EyesCry', 
        motion: null 
      }
    };

    const reaction = reactionMap[mood];
    if (reaction) {
      playReaction(reaction.expression, reaction.motion);
    }
  }, [mood, modelLoaded, playReaction]);

  // Animate message bubble when message changes
  useEffect(() => {
    if (messageRef.current && message) {
      messageRef.current.style.animation = 'none';
      setTimeout(() => {
        messageRef.current.style.animation = 'fadeSlideIn 0.4s ease-out';
      }, 10);
    }
  }, [message]);

  // Handle click interaction on Akari
  const handleAkariClick = useCallback(() => {
    if (!modelLoaded || !modelRef.current) return;

    // Clear existing timers
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Increment click count
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Reset click count after 1 second of no clicks
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);

    // 1-2 clicks: Love animation
    if (newClickCount === 1 || newClickCount === 2) {
      playExpression('EyesLove');
      playMotion('Love');
      setMessage('💕 Aww, you clicked me! I love you too!');

      // Reset after 5 seconds
      animationTimeoutRef.current = setTimeout(() => {
        playExpression(null);
        playMotion('Idle');
        setMessage('😊 Ready to help with your budget!');
      }, 5000);
    }
    // 3+ clicks: Annoyed/Crying
    else if (newClickCount >= 3) {
      playExpression('EyesCry');
      playExpression('SignAngry');
      playMotion('Shock');
      setMessage('😢😠 Hey! Stop poking me! That\'s too much!');

      // Reset after 5 seconds
      animationTimeoutRef.current = setTimeout(() => {
        playExpression(null);
        playMotion('Idle');
        setMessage('😊 Okay, I forgive you... Don\'t do it again!');
        setClickCount(0);
      }, 5000);
    }
  }, [clickCount, modelLoaded, playExpression, playMotion, setMessage]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Always render both the assistant and toggle button
  return (
    <>
      {/* Main Assistant - hidden when not visible */}
      <div className={`anime-assistant ${!isVisible ? 'assistant-hidden' : ''}`}>
        <div className="message-bubble" ref={messageRef}>
          {message}
        </div>
        <div className="assistant-character" onClick={handleAkariClick} style={{ cursor: 'pointer' }}>
          <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              Loading Akari...
            </div>
          )}
          {!modelLoaded && !loadError && !isLoading && (
            <div className="loading-indicator">Initializing...</div>
          )}
          {loadError && (
            <div className="loading-indicator" style={{ background: 'rgba(220, 53, 69, 0.9)' }}>
              Failed to load model. <br/>
              <small>Check console for details</small>
            </div>
          )}
        </div>
        <button className="assistant-close" onClick={toggleVisibility}>
          ✕
        </button>
      </div>

      {/* Toggle Button - shown when assistant is hidden */}
      {!isVisible && (
        <button className="assistant-toggle" onClick={toggleVisibility}>
          <span className="toggle-icon">💰</span>
        </button>
      )}
    </>
  );
};

export default AnimeAssistant;
