# MEDGPTz - Medical Education Student Platform

A modern React-based medical education platform featuring AI-powered quizzes, rich notes, and FSRS-based flashcards for medical students.

## Features

### Authentication
- **Login/Register**: Secure JWT-based authentication
- **Password Validation**: 8+ characters, uppercase, lowercase, number requirements
- **Session Persistence**: Auto-login with stored tokens
- **Protected Routes**: All features require authentication

### MedQuiz (API-Integrated)
- Browse quizzes by medical specialty and topic
- Multiple choice questions with instant feedback
- Progress tracking and scoring
- Quiz history and performance analytics

### MedNotes (API-Integrated)
- Rich text editor powered by TipTap
- Folder organization for notes
- Auto-save functionality
- Version history tracking
- Search across all notes

### MedCards (API-Integrated)
- FSRS (Free Spaced Repetition Scheduler) algorithm
- Folder and deck organization
- 4-button rating system (Again/Hard/Good/Easy)
- Study session scheduling
- Progress tracking per card

### Additional Features
- Dark/Light theme toggle
- Responsive design (mobile & desktop)
- Real-time chat interface
- User profile management
- Admin dashboard

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Rich Text**: TipTap Editor
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives
- **Notifications**: Sonner

## Project Structure

```
src/
├── api/                    # API client and services
│   ├── client.ts          # Base API client with auth
│   ├── auth.ts            # Authentication endpoints
│   ├── quizzes.ts         # Quiz API service
│   ├── notes.ts           # Notes API service
│   ├── flashcards.ts      # Flashcards API service
│   └── types.ts           # API type definitions
├── components/
│   ├── auth/              # Authentication components
│   │   ├── AuthPage.tsx   # Login/Register page
│   │   ├── LoginForm.tsx  # Login form
│   │   └── RegisterForm.tsx # Registration form
│   ├── ui/                # Reusable UI components
│   ├── MedQuizAPI.tsx     # API-integrated quiz
│   ├── MedNotesAPI.tsx    # API-integrated notes
│   ├── MedCardsAPI.tsx    # API-integrated flashcards
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── ChatArea.tsx       # AI chat interface
├── contexts/
│   └── AuthContext.tsx    # Authentication state
├── hooks/                 # Custom React hooks
│   ├── useApi.ts          # Generic API hook
│   ├── useQuiz.ts         # Quiz-specific hooks
│   ├── useNotes.ts        # Notes-specific hooks
│   └── useFlashcards.ts   # Flashcards-specific hooks
└── App.tsx                # Main application
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=/api
```

## API Integration

The frontend connects to a FastAPI backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Quizzes
- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Notes
- `GET /api/notes/folders` - List folders
- `GET /api/notes` - List notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Flashcards
- `GET /api/flashcards/folders` - List folders
- `GET /api/flashcards/decks` - List decks
- `GET /api/flashcards/cards` - List cards
- `POST /api/flashcards/study-sessions` - Create study session
- `POST /api/flashcards/reviews` - Submit card review

## Development

```bash
# Run development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```

## License

MIT License

## Credits

- Original design from [Figma](https://www.figma.com/design/0v2TZJY3rqLmOF3Hj6fwQr/MedGPT-Design-Brief)
- FSRS algorithm for spaced repetition
- TipTap for rich text editing
