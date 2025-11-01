# Dark Mode Text Visibility Fix

## Issue
In dark mode, text elements in the Settings page were invisible or blending with the background, making them unreadable. This affected:
- "Current Monthly Goal" / "New Monthly Goal" labels
- "Current All Time Goal" / "New All Time Goal" labels
- Info values (amounts in budget info section)
- Radio option labels
- Page header text
- Warning text in danger zone

## Root Cause
The Settings.css file had hardcoded colors (`#333`, `#666`, `#721c24`) that didn't adapt to dark mode. These colors were not being overridden by the dark theme CSS variables.

## Solution

### Added Dark Mode Styles (`client/src/theme.css`)

#### 1. Info Items (Budget Display)
```css
.dark-theme .info-item {
  color: var(--text-primary);
}

.dark-theme .info-label {
  color: var(--text-secondary);
}

.dark-theme .info-value {
  color: var(--text-primary);
}
```

#### 2. Stat Items (Account Stats)
```css
.dark-theme .stat-label {
  color: var(--text-secondary);
}

.dark-theme .stat-value {
  color: var(--text-primary);
}
```

#### 3. Radio Options (Avatar Selection)
```css
.dark-theme .radio-option {
  border-color: var(--border-color);
  background: var(--bg-tertiary);
}

.dark-theme .radio-option:hover {
  border-color: #818cf8;
  background: var(--bg-hover);
}

.dark-theme .radio-option span {
  color: var(--text-primary);
}

.dark-theme .radio-option input[type="radio"]:checked + span {
  color: #818cf8;
}
```

#### 4. Profile Preview
```css
.dark-theme .preview-image {
  border-color: var(--border-color);
}
```

#### 5. Danger Zone
```css
.dark-theme .danger-zone {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.dark-theme .danger-zone .section-title {
  color: #f87171;
  border-bottom-color: #ef4444;
}

.dark-theme .warning-text {
  color: #fca5a5;
}

.dark-theme .warning-list {
  background: var(--bg-tertiary);
  border-left-color: #ef4444;
}

.dark-theme .warning-list li {
  color: #fca5a5;
}
```

#### 6. Page Headers
```css
.dark-theme .page-header h1 {
  color: var(--text-primary);
}

.dark-theme .page-header p {
  color: var(--text-secondary);
}
```

## Color Variables Used

### Light Theme
- `--text-primary: #333333` (main text)
- `--text-secondary: #666666` (secondary text)
- `--bg-tertiary: #f8f9fa` (backgrounds)
- `--border-color: #e1e8ed` (borders)

### Dark Theme
- `--text-primary: #e5e7eb` (main text - light gray)
- `--text-secondary: #9ca3af` (secondary text - medium gray)
- `--bg-tertiary: #0f1629` (backgrounds - dark blue)
- `--border-color: #374151` (borders - dark gray)
- Special colors:
  - Purple accent: `#818cf8` (for interactive elements)
  - Red accent: `#f87171`, `#fca5a5` (for danger zone)

## Visual Changes

### Before (Dark Mode Issues):
- ❌ "Current All Time Goal:" label invisible
- ❌ Amount values blending with background
- ❌ Radio option text hard to read
- ❌ Page headers too dark
- ❌ Warning text invisible

### After (Dark Mode Fixed):
- ✅ Labels clearly visible in light gray (#9ca3af)
- ✅ Amount values bright and readable (#e5e7eb)
- ✅ Radio options with proper contrast
- ✅ Page headers legible
- ✅ Warning text visible in light red (#fca5a5)
- ✅ Hover states with purple accent (#818cf8)
- ✅ Smooth transitions between themes

## Files Modified
- `/client/src/theme.css` - Added comprehensive dark mode overrides for Settings page elements

## Testing Checklist
✅ Switch to dark mode in Settings
✅ All labels (Monthly Goal, All Time Goal) are visible
✅ All values (amounts) are clearly readable
✅ Radio options have good contrast
✅ Hover states work and are visible
✅ Danger zone maintains warning appearance
✅ Page header text is legible
✅ No text blending with background
