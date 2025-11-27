# 🎨 MedCards Folder System - UI Visual Guide

Complete visual reference for the folder hierarchy interface.

---

## 📐 Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         MedCards                                 │
├──────────────┬──────────────────────────────────────────────────┤
│              │  🏠 All > Internal Medicine > Cardiology         │
│  Folders     │                                                   │
│  ┌────────┐  │  Cardiology                              1 deck  │
│  │New Fldr│  │  ┌──────────────────────────────────────────┐   │
│  └────────┘  │  │ [Search decks...]                        │   │
│              │  └──────────────────────────────────────────┘   │
│  🏠 All Decks │                                                   │
│              │  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  ▼ 📁 Internal│  │ Deck 1  │ │ Deck 2  │ │ Deck 3  │           │
│    ▶ 📁 Cardio│  │ 127     │ │ 243     │ │ 156     │           │
│    ▶ 📁 Pulm  │  │ cards   │ │ cards   │ │ cards   │           │
│              │  └─────────┘ └─────────┘ └─────────┘           │
│  ▼ 📁 Pharmaco│                                                   │
│    ▶ 📁 CV Drg│                                                   │
│    ▶ 📁 Antibi│                                                   │
│              │                                                   │
│  ▶ 📁 Step 2  │                                                   │
│              │                                                   │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## 🗂️ Folder Sidebar (Left - 260px)

### Header Section
```
┌──────────────────────────┐
│  Folders                  │
│                           │
│  ┌─────────────────────┐ │
│  │  📁+ New Folder     │ │
│  └─────────────────────┘ │
└──────────────────────────┘
```

### All Decks (Root)
```
┌──────────────────────────┐
│  🏠 All Decks             │  ← Selected (blue bg)
└──────────────────────────┘
```

### Folder Tree Structure
```
▼ 📁 Internal Medicine     283  ← Expanded, has count badge
  ▶ 📁 Cardiology          127
  ▶ 📁 Pulmonology         156
  
▼ 📁 Pharmacology          243
  ▶ 📁 Cardiovascular Drugs 89
  📁 Antibiotics              ← Empty (no badge)
  
▶ 📁 Step 2 CK Review         ← Collapsed, empty
```

### Folder Row Anatomy
```
[▼] [📁] [Folder Name]  [127] [⋮]
 │    │        │          │    └─ Actions menu (hover)
 │    │        │          └────── Item count badge
 │    │        └───────────────── Folder name
 │    └────────────────────────── Folder icon (color-coded)
 └─────────────────────────────── Expand/collapse arrow
```

### States

#### Default
```
  📁 Cardiology  127
```

#### Hover
```
  📁 Cardiology  127  ⋮  ← Menu appears, bg changes
```

#### Selected
```
│ 📁 Cardiology  127  ⋮  ← Blue highlight, blue text
```

#### Expanded
```
▼ 📁 Cardiology  127  ⋮
  ▶ 📁 Arrhythmias  45
```

---

## 🍞 Breadcrumb Navigation

### At Root
```
🏠 All Decks
```

### One Level Deep
```
🏠 All  >  Internal Medicine
```

### Multi-Level
```
🏠 All  >  Internal Medicine  >  Cardiology  >  Arrhythmias
```

### Interactive States
```
🏠 All  >  Internal Med  >  Cardiology
└─┬──┘    └──────┬──────┘    └────┬────┘
  │              │                 │
Clickable    Clickable       Current (not clickable)
```

---

## 🎯 Context Menu (3-dot)

### Menu Appearance
```
┌─────────────────────────┐
│  📁+ New Subfolder      │
├─────────────────────────┤
│  ✏️  Rename             │
│  ➡️  Move               │
├─────────────────────────┤
│  🗑️  Delete             │
└─────────────────────────┘
```

### Hover States
```
│  📁+ New Subfolder      │  ← Blue highlight on hover
```

---

## 📝 Create/Rename Dialog

### Create Folder
```
┌─────────────────────────────────────┐
│  📁 Create New Folder               │
│                                     │
│  Create a new folder to organize... │
│                                     │
│  Folder Name                        │
│  ┌─────────────────────────────┐   │
│  │ e.g., Internal Medicine     │   │
│  └─────────────────────────────┘   │
│                                     │
│           [ Cancel ]  [ Create ]   │
└─────────────────────────────────────┘
```

### Create Subfolder
```
┌─────────────────────────────────────┐
│  📁 Create Subfolder                │
│                                     │
│  Create new subfolder inside...     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Parent Folder               │   │
│  │ 📁 Pharmacology             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Folder Name                        │
│  ┌─────────────────────────────┐   │
│  │ e.g., Antibiotics           │   │
│  └─────────────────────────────┘   │
│                                     │
│           [ Cancel ]  [ Create ]   │
└─────────────────────────────────────┘
```

### Rename Folder
```
┌─────────────────────────────────────┐
│  📁 Rename Folder                   │
│                                     │
│  Rename "Cardiology"                │
│                                     │
│  Folder Name                        │
│  ┌─────────────────────────────┐   │
│  │ Cardiology                  │   │  ← Pre-filled
│  └─────────────────────────────┘   │
│                                     │
│           [ Cancel ]  [ Rename ]   │
└─────────────────────────────────────┘
```

---

## ➡️ Move Folder Dialog

```
┌─────────────────────────────────────┐
│  Move Folder                        │
│                                     │
│  Choose new location for            │
│  "Cardiology"                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Current Location            │   │
│  │ 📁 Cardiology               │   │
│  └─────────────────────────────┘   │
│                                     │
│  Select Destination                 │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  🏠 Root (No parent)    ✓   │   │ ← Selected
│  │                             │   │
│  │  📁 Internal Medicine       │   │
│  │  📁 Pharmacology            │   │
│  │    📁 CV Drugs              │   │
│  │  📁 Step 2 CK Review        │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│           [ Cancel ]  [ Move Here ] │
└─────────────────────────────────────┘
```

---

## 📋 Main Content Area

### Header
```
┌────────────────────────────────────────────────────────┐
│  🏠 All > Pharmacology                                 │
│                                                        │
│  Pharmacology                      [ Import ]  [ New ] │
│  3 decks in this folder                                │
│                                                        │
│  🔍 [Search decks...]                                  │
└────────────────────────────────────────────────────────┘
```

### Deck Grid
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ 🃏       │  │ 🃏       │  │ 🃏       │
│          │  │          │  │          │
│ Cardio   │  │ Pulm     │  │ Neuro    │
│ 127      │  │ 156      │  │ 203      │
│          │  │          │  │          │
│ ⚡85 Auto│  │ ⚡120 Auto│  │ ⚡150 Auto│
└──────────┘  └──────────┘  └──────────┘
```

### Empty State
```
┌────────────────────────────────────────┐
│                                        │
│           📁                           │
│                                        │
│      This folder is empty              │
│                                        │
│   Add your first deck to this folder   │
│                                        │
│       [ 📁+ Create First Deck ]        │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎨 Color Coding

### Folder Colors (Default Palette)
```
📁 Internal Medicine    #3B82F6  (Blue)
📁 Cardiology          #EF4444  (Red)
📁 Pulmonology         #06B6D4  (Cyan)
📁 Pharmacology        #8B5CF6  (Purple)
📁 CV Drugs            #EC4899  (Pink)
📁 Antibiotics         #10B981  (Green)
📁 Step 2 CK           #F59E0B  (Amber)
```

### State Colors
```
Selected:     #2563EB (Blue primary)
Hover:        #F3F4F6 (Light gray)
Empty Badge:  #9CA3AF (Medium gray)
Icon:         Folder color or #6B7280
```

---

## 📏 Spacing & Sizing

### Sidebar
```
Width:           260px
Padding:         12px
Folder Row:      32px height
Indentation:     16px per level
Icon Size:       16px (size-4)
Badge:           text-xs, px-1.5
```

### Breadcrumb
```
Height:          40px
Font Size:       14px (text-sm)
Chevron:         14px
Padding:         8px between items
```

### Dialogs
```
Width:           max-w-md (448px)
Input Height:    40px
Button Height:   36px
Padding:         24px
```

---

## 🖱️ Interaction Patterns

### Folder Selection
```
Click → Select → Filter decks → Update breadcrumb
```

### Expand/Collapse
```
Click arrow → Toggle expanded → Show/hide children
```

### Create Folder
```
Button → Dialog → Enter name → Create → Tree updates
```

### Move Folder
```
Menu → Move dialog → Select destination → Move → Tree updates
```

### Navigate Up
```
Click breadcrumb → Select parent → Filter changes
```

---

## 🎭 Animation & Transitions

### Expand/Collapse
```css
transition: all 0.2s ease-in-out;
```

### Hover Effects
```css
transition: background-color 0.15s;
```

### Menu Open
```css
animation: fadeIn 0.1s;
```

### Tree Rendering
```
Smooth height transition
Children fade in
No layout shift
```

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
```
[Sidebar 260px] [Content Flexible]
```

### Tablet (768-1023px)
```
[Collapsible Sidebar] [Content]
    Toggle button in header
```

### Mobile (<768px)
```
[Full Width Content]
    Drawer for folders
    Bottom sheet picker
```

---

## ♿ Accessibility

### Keyboard Navigation
```
Tab:        Navigate between elements
Enter:      Select folder / Submit dialog
Escape:     Close dialog
Arrow keys: Navigate tree (planned)
```

### Screen Readers
```
aria-label="Folder tree"
aria-expanded="true/false"
aria-selected="true/false"
role="tree" / "treeitem"
```

### Visual
```
Focus outlines: 2px blue ring
High contrast: Passes WCAG AA
Color independent: Icons + text
```

---

## 🎯 Key Design Principles

1. **Clarity** - Clear visual hierarchy
2. **Efficiency** - Fast navigation
3. **Feedback** - Immediate visual response
4. **Consistency** - Matches medical aesthetic
5. **Simplicity** - No unnecessary complexity
6. **Flexibility** - Supports any organization
7. **Accessibility** - Works for everyone

---

**The UI is designed to be intuitive, fast, and beautiful for medical students! 🩺✨**
