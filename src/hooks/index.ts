/**
 * Hooks Module Exports
 *
 * Central export point for all custom React hooks.
 */

// Base API hooks
export { useApi, useMutation, usePaginatedApi } from './useApi';

// Quiz hooks
export {
  useSpecialties,
  useCategories,
  useQuizSession,
  useQuizAttempts,
  useCategoryProgress,
} from './useQuiz';

// Notes hooks
export {
  useNoteFolders,
  useNoteFolderTree,
  useNotes,
  useNote,
  useNoteCrud,
  useFolderCrud,
  useNoteActions,
  useNoteVersions,
  useNoteSearch,
  useNotesStats,
} from './useNotes';

// Flashcard hooks
export {
  useFlashcardFolders,
  useFlashcardFolderCrud,
  useFlashcardDecks,
  useFlashcardDeck,
  useDeckStats,
  useDeckCrud,
  useFlashcards,
  useCardCrud,
  useStudySession,
  useBulkReviewSync,
} from './useFlashcards';

// Statistics hooks
export {
  useStudentStats,
  useDailyActivity,
  useWeeklyProgress,
  useStudyStreak,
  useQuizStats,
  useFlashcardStats,
  useNotesStatsHook,
  useCategoryProgressList,
  useDeckProgressList,
  useActivityHeatmap,
  useDashboardStats,
} from './useStats';
