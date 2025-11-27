# 🩺 MedCards Module

Professional flashcard generation and Anki integration for MedGPT medical education platform.

## 🆕 NEW: Folder Hierarchy System

**Organize your decks with unlimited nested folders!**

✨ Create folders and subfolders at any depth  
✨ Tree-view navigation in sidebar  
✨ Breadcrumb path navigation  
✨ Drag-and-drop ready architecture  
✨ Visual indicators and badges  
✨ Smart folder operations  

**[📁 Complete Folder System Documentation →](./FOLDER_SYSTEM.md)**  
**[🎨 UI Visual Guide →](./UI_GUIDE.md)**  
**[📦 Implementation Summary →](./IMPLEMENTATION_SUMMARY.md)**

---

## 📁 Folder Structure

```
medcards/
├── index.tsx                           # 🎯 Main component (state & routing)
├── types.ts                            # 📋 TypeScript interfaces
├── README.md                           # 📚 This documentation
│
├── 📁 views/                           # 🖼️ Full-screen view components
│   ├── DeckListView.tsx                # Main deck grid overview
│   ├── UploadView.tsx                  # PDF upload & settings
│   ├── GeneratingView.tsx              # AI generation progress
│   ├── ReviewCardsView.tsx             # Review generated cards
│   └── ExportView.tsx                  # Anki export configuration
│
├── 📁 components/                      # 🧩 Reusable UI components
│   ├── DeckCard.tsx                    # Individual deck card
│   ├── FlashcardItem.tsx               # Individual flashcard display
│   └── CreateDeckDialog.tsx            # New deck creation modal
│
├── 📁 data/                            # 🎲 Sample/mock data
│   └── mockData.ts                     # Initial decks & cards
│
└── 📁 utils/                           # 🛠️ Helper functions
    └── index.ts                        # Cloze rendering, generators
```

---

## 🎯 Component Breakdown

### **Core Files**

#### `index.tsx` (Main Component)
- **Purpose**: Central state management and view routing
- **Responsibilities**:
  - Manages all application state (decks, cards, view modes)
  - Handles file upload, generation, import/export logic
  - Routes between different views
  - Orchestrates all feature workflows

#### `types.ts` (TypeScript Definitions)
```typescript
- Flashcard: Basic and Cloze card types
- Deck: Deck metadata and statistics
- ViewMode: Navigation state management
- ExportSettings: Anki export configuration
```

---

### **📁 views/** (Full-screen Views)

#### `DeckListView.tsx` - Main Overview
- Grid display of all flashcard decks
- Search/filter functionality
- Import Anki and Create Deck actions
- Deck selection for generation

#### `UploadView.tsx` - File Upload Interface
- Drag & drop PDF upload
- File validation
- Generation settings (card types, focus areas)
- File info display

#### `GeneratingView.tsx` - Progress Screen
- Animated AI generation progress
- Progress bar with percentage
- Status messages (analyzing, extracting, generating)

#### `ReviewCardsView.tsx` - Card Review Interface
- List of generated flashcards
- Batch selection (select all/deselect all)
- Individual card actions (edit, convert, delete)
- Save to deck functionality

#### `ExportView.tsx` - Anki Export
- Export settings configuration
- Card type filtering (all, basic, cloze)
- Scheduling data options
- Export summary statistics

---

### **📁 components/** (Reusable Components)

#### `DeckCard.tsx` - Individual Deck Card
- Color-coded by topic
- Statistics display (total, auto, imported, manual)
- Dropdown menu (export, edit, delete)
- Click to select deck

#### `FlashcardItem.tsx` - Individual Flashcard
- Type indicator (Basic/Cloze)
- Front/back display for basic cards
- Cloze preview toggle
- Tag display
- Action buttons (edit, convert, delete)
- Selection checkbox

#### `CreateDeckDialog.tsx` - Deck Creation Modal
- Name and description inputs
- Form validation
- Success toast notifications

---

### **📁 data/** (Mock Data)

#### `mockData.ts`
- **initialDecks**: Sample decks (Cardiology, Pharmacology, Pathology)
- **sampleCards**: Example flashcards for demonstration

---

### **📁 utils/** (Helper Functions)

#### `index.ts`
- **renderClozeText()**: Renders cloze deletions with preview
- **generateMockFlashcards()**: Creates sample AI-generated cards

---

## 🔄 View Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                  DECK LIST VIEW                      │
│  Grid of decks • Search • Import • Create           │
└───────────────┬─────────────────────────────────────┘
                │
                │ Select Deck
                ▼
┌─────────────────────────────────────────────────────┐
│                   UPLOAD VIEW                        │
│  Drag & drop PDF • Settings • Generate button       │
└───────────────┬─────────────────────────────────────┘
                │
                │ Click Generate
                ▼
┌─────────────────────────────────────────────────────┐
│                GENERATING VIEW                       │
│  Progress bar • Status messages • Animation          │
└───────────────┬─────────────────────────────────────┘
                │
                │ Generation Complete
                ▼
┌─────────────────────────────────────────────────────┐
│               REVIEW CARDS VIEW                      │
│  Select cards • Edit • Convert type • Delete         │
└───────────────┬─────────────────────────────────────┘
                │
                │ Save to Deck
                ▼
┌─────────────────────────────────────────────────────┐
│              DECK LIST VIEW (Return)                 │
│  Updated deck with new cards                         │
└─────────────────────────────────────────────────────┘

Alternative Flow: Export
┌─────────────────────────────────────────────────────┐
│                  DECK LIST VIEW                      │
│  Click "Export" on deck dropdown                     │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│                   EXPORT VIEW                        │
│  Configure settings • Download .apkg                 │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features

### ✅ Implemented
- ✅ PDF upload with drag & drop
- ✅ AI flashcard generation (mocked)
- ✅ Basic and Cloze card types
- ✅ Card type conversion
- ✅ Batch selection and editing
- ✅ Anki import/export (mocked)
- ✅ Deck management (create, search)
- ✅ Tag system
- ✅ Responsive design

### 🚀 Future Enhancements
- 🔮 Real AI integration (GPT-4, Claude)
- 🔮 Actual Anki file format (.apkg) generation
- 🔮 Rich text editor for card content
- 🔮 Spaced repetition algorithm
- 🔮 Study mode with statistics
- 🔮 Image support in flashcards
- 🔮 Audio pronunciation
- 🔮 Multi-language support
- 🔮 Deck sharing and collaboration

---

## 💡 Usage

### Basic Import
```tsx
import { MedCards } from './components/MedCards';

function App() {
  return <MedCards />;
}
```

### Standalone Usage
```tsx
import { MedCards } from './components/medcards';

// Use directly
<MedCards />
```

---

## 🎨 Theming

All components use CSS variables from `/styles/globals.css`:

### Colors
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--border-primary`
- `--blue-primary`, `--blue-hover`

### Auto Theme Support
Components automatically adapt to light/dark mode based on CSS variable values.

---

## 📊 File Size Reference

```
views/           ~3.5 KB each  (5 files = ~17.5 KB)
components/      ~2-3 KB each  (3 files = ~7.5 KB)
data/            ~1.5 KB
utils/           ~1.2 KB
types.ts         ~0.8 KB
index.tsx        ~8 KB
────────────────────────────────────────────
Total            ~36 KB (well-organized!)
```

---

## 🏗️ Architecture Benefits

### ✅ Separation of Concerns
Each component has a single, clear responsibility

### ✅ Scalability
Easy to add new views or features without touching existing code

### ✅ Maintainability
Clear folder structure makes it easy to locate and update code

### ✅ Reusability
Components can be imported and used independently

### ✅ Type Safety
Centralized TypeScript definitions prevent type errors

### ✅ Testability
Each component can be unit tested in isolation

---

## 🔧 Development

### Adding a New View
1. Create file in `/views/` folder
2. Import in `index.tsx`
3. Add view mode to `ViewMode` type
4. Add routing logic in main component

### Adding a New Component
1. Create file in `/components/` folder
2. Import where needed (views or other components)
3. Keep it reusable and focused

### Adding New Data
1. Add to `/data/mockData.ts`
2. Import in components that need it

---

**Built with ❤️ for medical students preparing for USMLE Step 2 CK**