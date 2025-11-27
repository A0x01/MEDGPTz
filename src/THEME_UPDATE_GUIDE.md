# MedGPT Theme Update Guide

## Overview
This guide outlines the changes needed to convert all hardcoded dark mode colors to theme-aware classes that support both light and dark modes.

## Color Mapping

### Background Colors
- `bg-[#0F0F0F]` → `bg-bg-primary` (White in light / #0F0F0F in dark)
- `bg-[#1F1F1F]` → `bg-bg-secondary` (Gray 50 in light / #1F1F1F in dark)
- `bg-[#2F2F2F]` → `bg-bg-tertiary` (Gray 100 in light / #2F2F2F in dark)
- `bg-[#3F3F3F]` → `bg-bg-tertiary` (use same as #2F2F2F)

### Text Colors
- `text-white` → `text-text-primary` (Dark gray in light / White in dark)
- `text-[#B4B4B4]` → `text-text-secondary` (Medium gray in light / #B4B4B4 in dark)
- `text-[#707070]` → `text-text-tertiary` (Light gray in light / #707070 in dark)

### Border Colors
- `border-[#404040]` → `border-border-primary` (Light gray in light / #404040 in dark)
- `border-[#505050]` → `border-border-hover` (Medium gray in light / #505050 in dark)
- `border-[#2F2F2F]` → `border-border-primary`

### Brand Colors (Blue - stays same in both themes)
- `bg-[#2563EB]` → `bg-blue-primary`
- `hover:bg-[#3B82F6]` → `hover:bg-blue-hover`

## Files Updated
✅ `/styles/globals.css` - Added theme variables
✅ `/App.tsx` - Updated main container
✅ `/components/Sidebar.tsx` - Full theme support
✅ `/components/ChatArea.tsx` - Full theme support
✅ `/components/ChatInput.tsx` - Full theme support

## Files Needing Updates
⚠️ `/components/MessageBubble.tsx`
⚠️ `/components/LoadingBubble.tsx`
⚠️ `/components/SourceCitation.tsx`
⚠️ `/components/MedQuiz.tsx`
⚠️ `/components/QuizWizard.tsx`
⚠️ `/components/MedNotes.tsx`
⚠️ `/components/MedCards.tsx`
⚠️ `/components/Profile.tsx`
⚠️ `/components/Settings.tsx`
⚠️ `/components/AdminDashboard.tsx`
⚠️ `/components/AddContentDialog.tsx`
⚠️ `/components/UserManagementModals.tsx`
⚠️ `/components/MedChatModal.tsx`
⚠️ `/components/ContextBanner.tsx`
⚠️ `/components/QuickTopicChips.tsx`

## Search & Replace Pattern

Use these Find/Replace patterns in your editor:

1. **Background colors:**
   - Find: `bg-\[#0F0F0F\]` → Replace: `bg-bg-primary`
   - Find: `bg-\[#1F1F1F\]` → Replace: `bg-bg-secondary`
   - Find: `bg-\[#2F2F2F\]` → Replace: `bg-bg-tertiary`
   - Find: `bg-\[#3F3F3F\]` → Replace: `bg-bg-tertiary`

2. **Text colors:**
   - Find: `text-\[#B4B4B4\]` → Replace: `text-text-secondary`
   - Find: `text-\[#707070\]` → Replace: `text-text-tertiary`
   - Find: `text-white` (where themed) → Replace: `text-text-primary`

3. **Border colors:**
   - Find: `border-\[#404040\]` → Replace: `border-border-primary`
   - Find: `border-\[#505050\]` → Replace: `border-border-hover`
   - Find: `border-\[#2F2F2F\]` → Replace: `border-border-primary`

4. **Brand colors:**
   - Find: `bg-\[#2563EB\]` → Replace: `bg-blue-primary`
   - Find: `hover:bg-\[#3B82F6\]` → Replace: `hover:bg-blue-hover`

## Important Notes

1. **Don't replace ALL text-white**: Some places like the blue primary button should keep `text-white` since white looks good on blue in both themes.

2. **Avatar/Icons**: Brand color icons (#2563EB) can stay as is since they work in both themes.

3. **Gradients & Special Cases**: Some gradients or special UI elements may need custom handling.

4. **Test Both Themes**: After updates, test the UI in both light and dark mode to ensure proper contrast and readability.

## CSS Variables Reference

```css
/* Light Theme (:root) */
--bg-primary: #FFFFFF;
--bg-secondary: #F8F9FA;
--bg-tertiary: #E9ECEF;
--text-primary: #1F2937;
--text-secondary: #6B7280;
--text-tertiary: #9CA3AF;
--border-primary: #E5E7EB;
--border-hover: #D1D5DB;
--blue-primary: #2563EB;
--blue-hover: #3B82F6;

/* Dark Theme (.dark) */
--bg-primary: #0F0F0F;
--bg-secondary: #1F1F1F;
--bg-tertiary: #2F2F2F;
--text-primary: #FFFFFF;
--text-secondary: #B4B4B4;
--text-tertiary: #707070;
--border-primary: #404040;
--border-hover: #505050;
```

## Testing Checklist

- [ ] Sidebar (navigation, textbooks, chat history)
- [ ] Chat interface (messages, input area)
- [ ] MedQuiz module
- [ ] MedNotes module
- [ ] MedCards module
- [ ] Profile page
- [ ] Settings page
- [ ] Admin Dashboard
- [ ] Dialogs/Modals
- [ ] Mobile responsive views
- [ ] Theme toggle functionality
