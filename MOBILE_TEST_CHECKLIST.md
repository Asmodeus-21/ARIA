# Mobile Button Testing Checklist

## Purpose
This checklist helps verify that all buttons and interactive elements work correctly on both desktop and mobile devices.

## Test Environment Setup

### Desktop Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Testing (Actual Devices Recommended)
- [ ] iOS Safari (iPhone)
- [ ] Android Chrome
- [ ] Test in both portrait and landscape orientations

### Responsive Testing (Browser DevTools)
- [ ] iPhone SE (375px width)
- [ ] iPhone 12/13/14 Pro (390px width)
- [ ] iPad (768px width)
- [ ] Desktop (1920px width)

## Interactive Elements to Test

### Header
- [ ] Logo button scrolls to top
- [ ] Navigation links scroll to sections (desktop)
- [ ] Get Started button opens lead modal
- [ ] Mobile menu toggle opens/closes properly
- [ ] Mobile menu items navigate correctly
- [ ] Mobile menu Get Started opens lead modal

### Hero Section
- [ ] Get Started button opens lead modal
- [ ] Watch Aria in Action opens voice modal
- [ ] Buttons have visible press feedback

### Pricing Section
- [ ] Trial plan button starts checkout
- [ ] Starter plan button starts checkout
- [ ] Growth plan button starts checkout
- [ ] Enterprise button opens lead modal
- [ ] All buttons show hover/active states

### CTA Section
- [ ] Start Now button opens lead modal
- [ ] Speak with Aria opens voice modal
- [ ] Buttons work on dark background

### Floating Chat
- [ ] Chat button opens chat window
- [ ] Chat window appears above all content
- [ ] Close button closes chat window
- [ ] Input field is tappable
- [ ] Send button works
- [ ] Chat interactions complete successfully

### Modals

#### Lead Capture Modal
- [ ] Modal appears centered on screen
- [ ] Modal is above all other content
- [ ] Close (X) button closes modal
- [ ] Input fields are all tappable
- [ ] Submit button is tappable
- [ ] Form submission works
- [ ] Success state displays properly
- [ ] Modal closes after submission

#### Voice Assistant Modal
- [ ] Modal appears centered on screen
- [ ] Modal is above all other content
- [ ] Close (X) button closes modal
- [ ] Microphone button is large enough to tap
- [ ] Mic button toggles recording state
- [ ] Visual feedback shows during recording

#### Chat Modal (if triggered)
- [ ] Modal appears centered on screen
- [ ] Modal is above all other content
- [ ] Close (X) button closes modal
- [ ] Input field is tappable
- [ ] Send button is tappable
- [ ] Messages display correctly

## Touch Target Verification

For each interactive element, verify:
- [ ] Element is at least 44x44px (use browser inspector)
- [ ] Element shows visual feedback on tap/click
- [ ] No accidental double-tap zoom
- [ ] Adjacent elements don't overlap tap areas

## Layering and Overlap Issues

- [ ] No background elements blocking buttons
- [ ] Modals appear above all content
- [ ] Floating chat appears above all content
- [ ] Dropdown menus appear above content
- [ ] No z-index conflicts

## Mobile-Specific Tests

### iOS Safari
- [ ] No double-tap zoom on buttons
- [ ] Safe area insets respected (notched devices)
- [ ] Smooth scrolling works
- [ ] No horizontal scroll issues

### Android Chrome
- [ ] Touch feedback is immediate
- [ ] No 300ms tap delay
- [ ] Back button doesn't break modals
- [ ] Keyboard doesn't overlap inputs

## Performance Tests

- [ ] Animations are smooth (60fps)
- [ ] No layout shift when opening modals
- [ ] Page loads quickly on 3G
- [ ] No console errors

## Accessibility Tests

- [ ] All buttons have aria-labels
- [ ] Keyboard navigation works
- [ ] Screen reader announces buttons correctly
- [ ] Focus states are visible

## Known Issues to Watch For

Based on previous problems:
- ❌ Buttons not responding on mobile → Check z-index conflicts
- ❌ Background blocking clicks → Check pointer-events on decorative elements
- ❌ Small touch targets → Verify 44x44px minimum
- ❌ No visual feedback → Check active states

## Regression Testing

After any UI changes, verify:
- [ ] All buttons still work on mobile
- [ ] Z-index values are from constants.tsx
- [ ] No new pointer-events: auto added unnecessarily
- [ ] Touch targets still meet 44px minimum
- [ ] Active states present on all buttons

## Reporting Issues

When reporting a button issue, include:
1. Device and browser used
2. Screen size/orientation
3. Which specific button isn't working
4. Steps to reproduce
5. Screenshot or video if possible
6. Console errors if any

## Success Criteria

All tests pass when:
- ✅ Every button responds on first tap/click
- ✅ Visual feedback is immediate and clear
- ✅ No double-tap zoom on any button
- ✅ All modals appear correctly layered
- ✅ Touch targets are comfortable to use
- ✅ No horizontal scrolling issues
- ✅ Smooth animations and transitions
