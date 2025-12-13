# ARIA Styling Guide

## Overview
This guide explains the styling system used in the ARIA AI Receptionist application, with a focus on ensuring consistent behavior across desktop and mobile devices.

## Z-Index System

### Problem Solved
Previously, the application used ad-hoc z-index values scattered throughout components, leading to:
- Buttons not working on mobile due to overlapping layers
- Inconsistent stacking contexts
- Difficult maintenance and debugging

### Solution
We've implemented a centralized z-index system in `constants.tsx` that ensures proper layering across all devices.

### Z-Index Layers (from bottom to top)

```typescript
export const zIndex = {
  // Background layers (behind content)
  background: -1,           // Fixed background textures/noise
  backgroundBlobs: 0,       // Animated gradient blobs
  
  // Content layers
  content: 10,              // Main content sections
  contentRaised: 20,        // Hero and important content
  
  // Navigation and interactive elements
  header: 100,              // Fixed header/navbar
  dropdown: 110,            // Dropdown menus
  
  // Modals and overlays
  modalBackdrop: 1000,      // Modal background overlay
  modal: 1010,              // Modal content
  
  // Floating elements (highest priority)
  floatingChat: 9000,       // Floating chat widget
  toast: 9100,              // Toast notifications (if added)
} as const;
```

### Usage in Components

Instead of hardcoding z-index values:
```tsx
// ❌ Old way
<div className="fixed z-[9999]">

// ✅ New way
import { zIndex } from '../constants';
<div className="fixed" style={{ zIndex: zIndex.floatingChat }}>
```

## Touch Interaction Guidelines

### Button Best Practices

1. **Minimum Touch Target**: All interactive elements must be at least 44x44px for mobile accessibility
   ```css
   button, a[role="button"] {
     min-height: 44px;
     min-width: 44px;
   }
   ```

2. **Touch Action**: Use `touch-action: manipulation` to prevent double-tap zoom
   ```tsx
   // Already applied globally to all buttons in index.html
   ```

3. **Visual Feedback**: Always include active states for touch feedback
   ```tsx
   className="... hover:scale-105 active:scale-95 transition"
   ```

4. **Remove Pointer-Events Conflicts**: 
   - Only use `pointer-events: none` on truly non-interactive elements
   - Remove unnecessary `pointer-events: auto` declarations
   - Let natural DOM behavior handle interactions

### Common Issues Fixed

1. **Background Layers Blocking Clicks**
   - All background layers now have `pointer-events: none`
   - Background z-index is negative or 0

2. **Excessive Pointer-Events Declarations**
   - Removed redundant `pointer-events-auto` classes
   - Let buttons naturally receive events

3. **Z-Index Conflicts**
   - Standardized all z-index values through constants
   - Ensured proper stacking order

## Mobile-Specific Optimizations

### Touch Action
```css
body {
  touch-action: pan-y pinch-zoom; /* Allow vertical scroll and pinch zoom */
}

button {
  touch-action: manipulation; /* Prevent double-tap zoom on buttons */
}
```

### Tap Highlight
```css
button, a[role="button"] {
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1); /* Subtle blue highlight */
  user-select: none; /* Prevent text selection on touch */
}
```

### Safe Area Insets
For elements near screen edges (especially on iOS):
```tsx
style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
```

## Component-Specific Notes

### Header
- Fixed positioning with `zIndex.header`
- Mobile menu dropdown uses `zIndex.dropdown`
- All navigation items properly sized for touch

### Modals
- All modals use consistent `zIndex.modalBackdrop` and `zIndex.modal`
- Backdrop prevents interaction with content below
- Close buttons have proper touch targets

### Floating Chat
- Highest z-index (`zIndex.floatingChat`)
- 16x16 button size (64px) for easy tapping
- Safe area inset support for notched devices

### Hero Buttons
- Large touch targets (px-8 py-4)
- Clear visual feedback on press
- No z-index conflicts with background

## Testing Guidelines

When adding new interactive elements:

1. **Desktop Check**
   - Hover states work correctly
   - Click events fire as expected
   - Visual feedback is clear

2. **Mobile Check**
   - Buttons are large enough (44x44px minimum)
   - Active state shows on touch
   - No double-tap zoom on buttons
   - Works correctly near screen edges
   - Safe area insets respected on notched devices

3. **Cross-Device Check**
   - Test on actual mobile device, not just browser dev tools
   - Check both iOS Safari and Android Chrome
   - Verify landscape and portrait orientations

## Adding New Interactive Elements

When adding new buttons or interactive elements:

```tsx
import { zIndex } from '../constants';

// 1. Determine appropriate z-index layer
const style = { zIndex: zIndex.content }; // Choose appropriate layer

// 2. Add proper button classes
<button
  onClick={handleClick}
  className="
    px-6 py-3                    // Adequate touch target
    hover:scale-105              // Hover feedback
    active:scale-95              // Touch feedback
    transition                   // Smooth transitions
  "
  aria-label="Descriptive label" // Accessibility
>
  Button Text
</button>
```

## Modifying the Z-Index System

If you need to add a new layer:

1. Add to `constants.tsx`:
```typescript
export const zIndex = {
  // ... existing layers
  newLayer: 500,  // Insert at appropriate level
} as const;
```

2. Update this documentation
3. Test all affected components

## Common Pitfalls to Avoid

1. ❌ **Don't use arbitrary z-index values**
   ```tsx
   <div className="z-[99999]"> // Don't do this
   ```

2. ❌ **Don't add pointer-events unless necessary**
   ```tsx
   className="pointer-events-auto" // Usually unnecessary
   ```

3. ❌ **Don't forget active states**
   ```tsx
   className="hover:bg-blue-700" // Missing active:bg-blue-800
   ```

4. ❌ **Don't make touch targets too small**
   ```tsx
   <button className="p-1"> // Too small for touch
   ```

## Future Improvements

Consider these enhancements:
- Toast notification system using `zIndex.toast`
- Tooltip system at appropriate z-index
- Loading overlays at modal backdrop level
- Focus trap management for modals

## Questions?

If you encounter issues with:
- Buttons not working on mobile → Check z-index conflicts
- Elements not clickable → Check pointer-events on parent/ancestors
- Visual glitches on touch → Check active states and transitions
