# 📁 MedCards Folder Hierarchy System

Complete documentation for the folder organization feature.

---

## 🎯 Overview

The folder system allows users to organize their flashcard decks into nested folders with unlimited depth. It provides an intuitive tree-view interface with drag-and-drop support, breadcrumb navigation, and comprehensive folder management.

---

## ✨ Features

### Core Functionality
✅ **Unlimited Nesting** - Create folders within folders at any depth  
✅ **Tree View Navigation** - Collapsible folder tree in left sidebar  
✅ **Breadcrumb Navigation** - Visual path showing current location  
✅ **Folder Actions** - Create, rename, delete, move folders  
✅ **Visual Indicators** - Icons showing folder status (empty, has content, expanded/collapsed)  
✅ **Smart Deletion** - Prevents deleting folders containing decks  
✅ **Search Integration** - Search within folders or across all content  
✅ **Empty States** - Helpful UI when folders are empty  
✅ **Keyboard Shortcuts** - Fast navigation with arrow keys (planned)  

---

## 🏗️ Architecture

### File Structure
```
medcards/
├── types.ts                        # Folder interface
├── data/mockData.ts                # Sample folder hierarchy
│
├── utils/
│   └── folderUtils.ts              # Folder tree utilities
│
├── components/
│   ├── FolderTree.tsx              # Main folder sidebar
│   ├── FolderNode.tsx              # Individual folder row
│   ├── Breadcrumb.tsx              # Path navigation
│   ├── FolderDialog.tsx            # Create/rename dialog
│   └── MoveFolderDialog.tsx        # Move folder dialog
│
└── views/
    └── DeckListView.tsx            # Updated with folder support
```

### Type Definitions

```typescript
interface Folder {
  id: string;
  name: string;
  parentId: string | null;        // null = root folder
  color?: string;                 // Folder color
  icon?: string;                  // Custom icon (future)
  deckCount: number;              // Number of decks
  cardCount: number;              // Total cards in decks
  isExpanded: boolean;            // UI state
  createdAt: Date;
  children?: Folder[];            // Built by tree utility
}
```

---

## 🎨 UI Components

### 1. FolderTree (Sidebar)
**Location:** Left sidebar (260px wide)  
**Purpose:** Main folder navigation

**Features:**
- "New Folder" button at top
- "All Decks" root view
- Collapsible folder tree
- Item count badges
- Context menu on each folder

**Visual States:**
- Selected folder (blue highlight)
- Hover state (background change)
- Empty folder (no badge)
- Expanded/collapsed icons

---

### 2. FolderNode (Tree Item)
**Purpose:** Individual folder row in tree

**Anatomy:**
```
[Arrow] [Icon] [Name]  [Count] [⋮ Menu]
```

**Interactions:**
- Click: Select folder
- Arrow: Expand/collapse
- Three-dot menu: Actions

**Indentation:**
- Each level indented 16px
- Visual depth hierarchy

---

### 3. Breadcrumb Navigation
**Location:** Top of main content area  
**Purpose:** Show current path

**Format:**
```
🏠 All > Internal Medicine > Cardiology
```

**Features:**
- Click any segment to navigate up
- Hover states
- Truncates long names
- Scrolls horizontally if needed

---

### 4. Folder Dialogs

#### Create/Rename Dialog
**Fields:**
- Folder name (text input)
- Parent folder display (if subfolder)

**Validation:**
- Name required
- Enter key submits

#### Move Folder Dialog
**Features:**
- Current location display
- Scrollable folder tree
- Root option
- Prevents moving into descendants
- Visual selection state

---

## 🔄 User Flows

### Creating a Root Folder
```
1. Click "New Folder" in sidebar
2. Enter folder name
3. Click "Create"
4. Folder appears at root level
```

### Creating a Subfolder
```
1. Right-click folder → "New Subfolder"
2. Enter subfolder name
3. Click "Create"
4. Subfolder appears under parent
```

### Renaming a Folder
```
1. Right-click folder → "Rename"
2. Edit name in dialog
3. Click "Rename"
4. Folder name updates
```

### Moving a Folder
```
1. Right-click folder → "Move"
2. Select new parent from tree
   (or choose "Root")
3. Click "Move Here"
4. Folder relocates
```

### Deleting a Folder
```
1. Right-click folder → "Delete"
2. If empty: Deleted immediately
3. If has decks: Error message
   "Cannot delete folder with X deck(s)"
```

### Navigating Folders
```
Method 1: Click folder in sidebar
Method 2: Click breadcrumb segment
Method 3: Click "All Decks" for root
```

---

## 🛠️ Utility Functions

### buildFolderTree(folders)
Converts flat folder array into nested tree structure.

```typescript
Input:  Folder[] (flat)
Output: Folder[] (nested with children)
```

### getFolderPath(folderId, folders)
Returns array of folders from root to target.

```typescript
Input:  folderId: string, folders: Folder[]
Output: Folder[] (path from root)
```

### getDescendantIds(folderId, folders)
Gets all child folder IDs recursively.

```typescript
Input:  folderId: string, folders: Folder[]
Output: string[] (all descendant IDs)
```

### sortFolders(folders, sortBy)
Sorts folders by name, date, or item count.

```typescript
sortBy: 'name' | 'date' | 'items'
```

### getFolderDepth(folderId, folders)
Calculates nesting depth of a folder.

```typescript
Input:  folderId: string, folders: Folder[]
Output: number (0 = root)
```

---

## 🎨 Visual Design

### Color System
- Selected folder: `bg-blue-primary/10` with `border-blue-primary`
- Hover: `bg-bg-tertiary`
- Icons: Folder color or `#6B7280` default
- Empty folders: No color badge

### Icons
- **Folder**: Closed folder icon
- **FolderOpen**: Expanded folder icon
- **ChevronRight**: Collapsed indicator
- **ChevronDown**: Expanded indicator
- **Home**: Root "All Decks" view

### Spacing
- Folder row height: `py-1.5` (6px vertical)
- Indentation: 16px per level
- Sidebar width: 260px
- Gap between folders: 2px

---

## 🚀 Advanced Features (Planned)

### Keyboard Shortcuts
```
Ctrl/Cmd + Shift + N  → New folder
Arrow Up/Down         → Navigate folders
Arrow Right           → Expand folder
Arrow Left            → Collapse folder
Enter                 → Select folder
Delete                → Delete selected folder
```

### Drag and Drop
- Drag decks to folders
- Drag folders to reorder
- Drag folders into other folders
- Visual drop indicators

### Folder Colors
- Custom color picker
- Pre-defined color palette
- Color inheritance (optional)

### Smart Folders
- Auto-organize by tags
- Date-based folders
- Dynamic filters

### Bulk Operations
- Move multiple decks at once
- Multi-select folders
- Batch rename
- Export entire folder

---

## 📊 Data Flow

### State Management
```typescript
// Main component state
const [folders, setFolders] = useState<Folder[]>([]);
const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
```

### Folder Operations
```typescript
// Create
handleCreateFolder(name, parentId)
  → Create new folder object
  → Add to folders array
  → Show toast notification

// Rename
handleRenameFolder(folderId, newName)
  → Find folder by ID
  → Update name
  → Toast confirmation

// Delete
handleDeleteFolder(folderId)
  → Check for child decks
  → If has decks: Show error
  → If empty: Remove from array
  → Remove all descendants

// Move
handleMoveFolder(folderId, newParentId)
  → Update parentId
  → Recalculate tree
  → Toast confirmation
```

---

## 🧪 Example Data Structure

```typescript
// Flat folder array (stored)
[
  {
    id: 'folder-1',
    name: 'Internal Medicine',
    parentId: null,
    deckCount: 2,
    cardCount: 283,
    isExpanded: true,
  },
  {
    id: 'folder-2',
    name: 'Cardiology',
    parentId: 'folder-1',
    deckCount: 1,
    cardCount: 127,
    isExpanded: false,
  }
]

// After buildFolderTree()
[
  {
    id: 'folder-1',
    name: 'Internal Medicine',
    parentId: null,
    children: [
      {
        id: 'folder-2',
        name: 'Cardiology',
        parentId: 'folder-1',
        children: []
      }
    ]
  }
]
```

---

## 🎯 Best Practices

### For Users
1. Use descriptive folder names
2. Organize by subject/topic hierarchy
3. Don't nest too deeply (3-4 levels max recommended)
4. Use search for quick access
5. Collapse unused folders

### For Developers
1. Always validate parentId exists
2. Prevent circular references
3. Check for descendants before deletion
4. Update folder counts when decks move
5. Maintain isExpanded state in localStorage
6. Use memoization for tree building

---

## 🐛 Edge Cases Handled

✅ Deleting folder with children → Prevented  
✅ Moving folder into itself → Prevented  
✅ Moving folder into its descendant → Prevented  
✅ Orphaned folders → Automatically rooted  
✅ Empty folder deletion → Allowed  
✅ Duplicate names → Allowed (different IDs)  
✅ Deep nesting → No limit (UI handles it)  

---

## 📱 Responsive Design

### Desktop (≥1024px)
- Sidebar always visible (260px)
- Full tree view
- Three-column layout

### Tablet (768px - 1023px)
- Collapsible sidebar
- Toggle button in header
- Two-column when sidebar open

### Mobile (<768px)
- Slide-out drawer for folders
- Bottom sheet on mobile
- Full-width content
- Tap to expand folders

---

## 🎨 Theme Support

All folder components use CSS variables:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--border-primary`
- `--blue-primary`, `--blue-hover`

Automatically adapts to light/dark mode! 🌓

---

**Built for organization. Designed for scale. Optimized for clarity.** 📁✨
