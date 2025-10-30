import React, { useState, useEffect, useRef } from 'react';

// Akari messages based on different contexts
const akariMessages = {
  welcome: [
    "Hi there! I'm Akari, your personal finance assistant! 💖",
    "Welcome back! Ready to manage your finances together?",
    "Hello! Let's make budgeting fun today!"
  ],
  addExpense: [
    "Great job tracking your expense! 📝",
    "Every transaction counts! You're doing amazing!",
    "Recorded! Keep up the good tracking!"
  ],
  addIncome: [
    "Yay! Income added! You're building your wealth! 💰",
    "Wonderful! Your balance is growing!",
    "Great news! More income means more opportunities!"
  ],
  highSpending: [
    "Hmm, you've been spending quite a bit lately. Maybe time to review? 🤔",
    "I notice your expenses are high. Want to set a budget?",
    "Your spending is trending up. Let's be mindful!"
  ],
  goalAchieved: [
    "🎉 Congratulations! You've reached your goal!",
    "Amazing work! Goal completed! You're a budgeting superstar!",
    "Success! You did it! Time to celebrate (responsibly)! 🎊"
  ],
  savingsProgress: [
    "You're making great progress on your savings! Keep it up! 💪",
    "Your savings are growing! I'm so proud of you!",
    "Little by little, you're building your future!"
  ],
  motivation: [
    "Remember, every small step counts towards your financial goals! 🌟",
    "You're doing better than you think! Keep going!",
    "Financial freedom is a journey, not a destination. You've got this!"
  ]
};

const AkariAssistant = ({ context = 'welcome', customMessage }) => {
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Select a random message from the context
    const messages = akariMessages[context] || akariMessages.welcome;
    const selectedMessage = customMessage || messages[Math.floor(Math.random() * messages.length)];
    setMessage(selectedMessage);
    setShowMessage(true);

    // Auto-hide message after 8 seconds
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [context, customMessage]);

  useEffect(() => {
    // Simple canvas animation for Akari
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrame;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a simple anime-style character representation
      // Background circle (face)
      ctx.fillStyle = '#FFE5D9';
      ctx.beginPath();
      ctx.arc(140, 120, 60, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#4A5568';
      // Left eye
      ctx.beginPath();
      ctx.arc(125, 110, 8, 0, Math.PI * 2);
      ctx.fill();
      // Right eye
      ctx.beginPath();
      ctx.arc(155, 110, 8, 0, Math.PI * 2);
      ctx.fill();

      // Eye shine
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(127, 108, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(157, 108, 3, 0, Math.PI * 2);
      ctx.fill();

      // Mouth (smile)
      ctx.strokeStyle = '#4A5568';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(140, 125, 20, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Hair (simple triangles)
      ctx.fillStyle = '#8B7355';
      ctx.beginPath();
      ctx.moveTo(100, 80);
      ctx.lineTo(90, 110);
      ctx.lineTo(110, 100);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(180, 80);
      ctx.lineTo(190, 110);
      ctx.lineTo(170, 100);
      ctx.fill();

      // Body (simple)
      ctx.fillStyle = '#E0BBE4';
      ctx.fillRect(110, 180, 60, 80);

      // Arms (animated slight wave)
      ctx.strokeStyle = '#FFE5D9';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      
      // Left arm
      ctx.beginPath();
      ctx.moveTo(110, 200);
      ctx.lineTo(80, 220 + Math.sin(time) * 5);
      ctx.stroke();
      
      // Right arm
      ctx.beginPath();
      ctx.moveTo(170, 200);
      ctx.lineTo(200, 220 + Math.sin(time + Math.PI) * 5);
      ctx.stroke();

      // Blush
      ctx.fillStyle = 'rgba(255, 182, 193, 0.3)';
      ctx.beginPath();
      ctx.arc(115, 125, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(165, 125, 10, 0, Math.PI * 2);
      ctx.fill();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="akari-container">
      {showMessage && message && (
        <div className="akari-speech">
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{message}</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        width={280} 
        height={280}
        style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      />
    </div>
  );
};

export default AkariAssistant;
