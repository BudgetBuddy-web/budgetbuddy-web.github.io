# 🎭 Akari Interactive Features

## 👆 Click Interactions

Akari (the Live2D anime assistant) now responds to your clicks with different reactions!

### 💕 Love Mode (1-2 Clicks)

**Trigger:** Click Akari once or twice

**Reaction:**
- **Expression:** Heart eyes (EyesLove)
- **Animation:** Love motion
- **Message:** "💕 Aww, you clicked me! I love you too!"
- **Duration:** 5 seconds
- **After:** Returns to idle with "😊 Ready to help with your budget!"

### 😢😠 Annoyed Mode (3+ Clicks)

**Trigger:** Click Akari 3 or more times continuously (within 1 second)

**Reaction:**
- **Expressions:** Crying eyes (EyesCry) + Angry sign (SignAngry)
- **Animation:** Shock motion
- **Message:** "😢😠 Hey! Stop poking me! That's too much!"
- **Duration:** 5 seconds
- **After:** Returns to idle with "😊 Okay, I forgive you... Don't do it again!"

---

## 🎯 How It Works

### Click Detection
- Tracks number of clicks within a 1-second window
- Resets after 1 second of no activity
- Different reactions based on click count

### Visual Feedback
- **Hover:** Akari scales up slightly (1.05x) to show she's clickable
- **Click:** Scales down briefly (0.98x) for tactile feedback
- **Cursor:** Changes to pointer when hovering over Akari

### Animation Timing
- Reactions last for 5 seconds
- Automatically returns to idle state
- Previous animations are canceled if you click again

---

## 🎨 Technical Details

### State Management
```javascript
const [clickCount, setClickCount] = useState(0);
const clickTimerRef = useRef(null);
const animationTimeoutRef = useRef(null);
```

### Click Handler
```javascript
const handleAkariClick = useCallback(() => {
  // Increment click count
  // Reset after 1 second
  // Trigger appropriate animation
  // Reset to idle after 5 seconds
}, [dependencies]);
```

### CSS Enhancements
```css
.assistant-character {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.assistant-character:hover {
  transform: scale(1.05);
}

.assistant-character:active {
  transform: scale(0.98);
}
```

---

## 📱 Mobile Support

The click interactions work perfectly on mobile devices too!

- **Touch:** Tap Akari with your finger
- **Multiple Taps:** Tap quickly 3+ times to annoy her
- **Feedback:** Same animations and messages
- **Performance:** Optimized for touch devices

---

## 🎮 Tips for Best Experience

1. **Single Click:** Try clicking once - she'll show you love! 💕
2. **Double Click:** Click twice quickly for the same loving reaction
3. **Spam Click:** Click 3+ times rapidly to see her get annoyed! 😠
4. **Wait & Watch:** After triggering a reaction, wait 5 seconds to see her return to normal
5. **Interactive Fun:** Try different clicking patterns!

---

## 🔮 Future Interaction Ideas

Potential enhancements:
- [ ] Long press for special interaction
- [ ] Drag to move Akari around
- [ ] Different reactions based on time of day
- [ ] Special reactions when you achieve savings goals
- [ ] Voice responses (with audio)
- [ ] More complex gesture recognition
- [ ] Easter eggs for specific click patterns
- [ ] Mood changes based on recent transactions

---

## 🐛 Troubleshooting

**Akari doesn't respond to clicks:**
- Make sure the model is fully loaded (wait for "Loading Akari..." to disappear)
- Check browser console for errors
- Try refreshing the page
- Ensure JavaScript is enabled

**Animations are laggy:**
- Close other browser tabs
- Disable browser extensions
- Check if hardware acceleration is enabled
- Try on a different browser (Chrome recommended)

**Can't see the cursor change:**
- Make sure you're hovering directly over Akari
- Check if you have custom cursor settings in your OS
- Try zooming in/out

---

## 📝 Code Location

The click interaction code is in:
- **Component:** `client/src/components/AnimeAssistant.js`
- **Styles:** `client/src/components/AnimeAssistant.css`
- **Context:** `client/src/contexts/AssistantContext.js`

---

**Have fun interacting with Akari! 🎉**

Remember: She's here to help with your budget, but she also appreciates some love... just don't overdo it! 😊
