# 📂 MedCards Folder Structure

```
medcards/
│
├── 📄 index.tsx                          # Main component (state management & routing)
├── 📄 types.ts                           # TypeScript interfaces & types
├── 📄 README.md                          # Complete documentation
├── 📄 STRUCTURE.md                       # This file
│
├── 📁 views/                             # Full-screen view components
│   ├── 📄 DeckListView.tsx               # Main deck overview screen
│   ├── 📄 UploadView.tsx                 # PDF upload interface
│   ├── 📄 GeneratingView.tsx             # AI generation progress
│   ├── 📄 ReviewCardsView.tsx            # Review generated cards
│   └── 📄 ExportView.tsx                 # Anki export settings
│
├── 📁 components/                        # Reusable UI components
│   ├── 📄 DeckCard.tsx                   # Individual deck card
│   ├── 📄 FlashcardItem.tsx              # Individual flashcard
│   └── 📄 CreateDeckDialog.tsx           # New deck creation modal
│
├── 📁 data/                              # Sample/mock data
│   └── 📄 mockData.ts                    # Initial decks & cards
│
└── 📁 utils/                             # Helper functions
    └── 📄 index.ts                       # Cloze rendering, generators
```

---

## 📊 File Statistics

| Folder       | Files | Purpose                           |
|--------------|-------|-----------------------------------|
| Root         | 2     | Main component & types            |
| views/       | 5     | Full-screen page views            |
| components/  | 3     | Reusable UI components            |
| data/        | 1     | Mock/sample data                  |
| utils/       | 1     | Helper functions                  |
| **TOTAL**    | **12**| **Well-organized module**        |

---

## 🎯 Component Hierarchy

```
MedCards (index.tsx)
├── DeckListView
│   ├── DeckCard (×N)
│   └── CreateDeckDialog
│
├── UploadView
│   └── (file upload interface)
│
├── GeneratingView
│   └── (progress indicator)
│
├── ReviewCardsView
│   └── FlashcardItem (×N)
│
└── ExportView
    └── (export configuration)
```

---

## 🔄 Import Paths

### From root component
```tsx
import { MedCards } from './components/MedCards';
// or
import { MedCards } from './components/medcards';
```

### Internal imports (within medcards/)
```tsx
// Views
import { DeckListView } from './views/DeckListView';
import { UploadView } from './views/UploadView';

// Components
import { DeckCard } from './components/DeckCard';
import { FlashcardItem } from './components/FlashcardItem';

// Data
import { initialDecks, sampleCards } from './data/mockData';

// Utils
import { renderClozeText, generateMockFlashcards } from './utils';

// Types
import { Deck, Flashcard, ViewMode } from './types';
```

---

## 📦 What Each Folder Contains

### 📁 **views/** - Full-screen Views
Large components that take up the entire main content area. Each view represents a different "page" or mode in the application.

**Characteristics:**
- Full-screen layout
- Contains header, content area, and actions
- Routes to other views
- Uses smaller components from `/components/`

### 📁 **components/** - Reusable Components
Small, focused, reusable components that are used within views or other components.

**Characteristics:**
- Single responsibility
- Highly reusable
- Props-driven
- No routing logic

### 📁 **data/** - Sample Data
Mock data used for demonstration and development.

**Characteristics:**
- Static sample data
- Type-safe exports
- Easy to replace with API calls

### 📁 **utils/** - Helper Functions
Pure utility functions without UI.

**Characteristics:**
- Pure functions
- No side effects
- Reusable logic
- Easy to unit test

---

## 🎨 Benefits of This Structure

✅ **Clear Separation**: Views vs Components vs Data vs Utils  
✅ **Easy Navigation**: Find any file in <3 seconds  
✅ **Scalable**: Add new features without restructuring  
✅ **Maintainable**: Update one part without affecting others  
✅ **Testable**: Test each piece independently  
✅ **Onboarding**: New developers understand structure instantly  

---

## 🚀 Adding New Features

### Adding a New View
```bash
# 1. Create file
/views/NewFeatureView.tsx

# 2. Import in index.tsx
import { NewFeatureView } from './views/NewFeatureView';

# 3. Add route logic
{viewMode === 'new-feature' && <NewFeatureView />}
```

### Adding a New Component
```bash
# 1. Create file
/components/NewComponent.tsx

# 2. Use in views
import { NewComponent } from '../components/NewComponent';
```

---

**Organized for scale. Built for maintainability. Optimized for clarity.** ✨
