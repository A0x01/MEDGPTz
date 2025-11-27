/**
 * API Types for MedGPT Student Platform
 *
 * TypeScript interfaces matching backend Pydantic schemas.
 */

// ============================================================================
// Common Types
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ============================================================================
// Enums
// ============================================================================

export type QuizMode = 'standard' | 'timed' | 'review' | 'incorrect' | 'random';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type FlashcardState = 'new' | 'learning' | 'review' | 'relearning';
export type FlashcardType = 'basic' | 'cloze' | 'image' | 'reversed';
export type FlashcardSource = 'manual' | 'auto' | 'imported';

// ============================================================================
// Quiz Types
// ============================================================================

export interface QuizSpecialty {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  question_count: number;
  created_at: string;
  updated_at?: string;
}

export interface QuizCategory {
  id: number;
  specialty_id: number;
  name: string;
  display_name: string;
  description?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  question_count: number;
  created_at: string;
  updated_at?: string;
}

export interface QuizOption {
  id: number;
  title: string;
  content?: string;
  sort_order: number;
  percentage?: number;
}

export interface QuizOptionWithAnswer extends QuizOption {
  is_correct: boolean;
  category_count: number;
  session_count: number;
  attachments?: Record<string, unknown>;
}

export interface QuizQuestion {
  id: number;
  category_id: number;
  original_question_id?: number;
  title: string;
  additional_text?: string;
  image?: string;
  difficulty: QuestionDifficulty;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface QuizQuestionWithOptions extends QuizQuestion {
  options: QuizOption[];
}

export interface QuizSessionStart {
  category_ids?: number[];
  specialty_id?: number;
  mode?: QuizMode;
  question_count?: number;
  time_limit_minutes?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
}

export interface QuizSessionResponse {
  attempt_id: number;
  questions: QuizQuestionWithOptions[];
  total_questions: number;
  time_limit_minutes?: number;
  mode: QuizMode;
  started_at: string;
}

export interface AnswerSubmission {
  question_id: number;
  selected_option_id: number;
  time_spent_seconds?: number;
}

export interface AnswerResult {
  question_id: number;
  selected_option_id: number;
  correct_option_id: number;
  is_correct: boolean;
  explanation?: string;
  options: QuizOptionWithAnswer[];
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  category_id?: number;
  specialty_id?: number;
  mode: QuizMode;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  score_percentage: number;
  time_spent_seconds: number;
  completed_at?: string;
  created_at: string;
}

export interface CategoryProgress {
  category_id: number;
  category_name: string;
  specialty_name: string;
  total_questions: number;
  attempted_questions: number;
  correct_answers: number;
  accuracy_percentage: number;
  last_attempted?: string;
}

// ============================================================================
// Notes Types
// ============================================================================

export interface NoteFolder {
  id: number;
  user_id: number;
  parent_id?: number;
  name: string;
  path: string;
  color?: string;
  icon?: string;
  sort_order: number;
  note_count: number;
  created_at: string;
  updated_at?: string;
}

export interface NoteFolderTree extends NoteFolder {
  children: NoteFolderTree[];
  notes_preview: NotePreview[];
}

export interface NotePreview {
  id: number;
  title: string;
  excerpt?: string;
  is_pinned: boolean;
  is_archived: boolean;
  word_count: number;
  tags?: string[];
  updated_at?: string;
  created_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  folder_id?: number;
  title: string;
  content?: string;
  excerpt?: string;
  word_count: number;
  character_count: number;
  is_pinned: boolean;
  is_archived: boolean;
  tags?: string[];
  version_count: number;
  created_at: string;
  updated_at?: string;
}

export interface NoteDetail extends Note {
  folder?: NoteFolder;
}

export interface NoteVersion {
  id: number;
  note_id: number;
  version_number: number;
  title: string;
  content?: string;
  word_count: number;
  change_summary?: string;
  created_at: string;
}

export interface NoteCreate {
  title: string;
  content?: string;
  folder_id?: number;
  is_pinned?: boolean;
  is_archived?: boolean;
  tags?: string[];
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  folder_id?: number;
  is_pinned?: boolean;
  is_archived?: boolean;
  tags?: string[];
}

export interface NoteFolderCreate {
  name: string;
  parent_id?: number;
  color?: string;
  icon?: string;
  sort_order?: number;
}

// ============================================================================
// Flashcard Types
// ============================================================================

export interface FlashcardFolder {
  id: number;
  user_id: number;
  parent_id?: number;
  name: string;
  path: string;
  color?: string;
  icon?: string;
  sort_order: number;
  deck_count: number;
  card_count: number;
  created_at: string;
  updated_at?: string;
}

export interface FlashcardDeck {
  id: number;
  user_id: number;
  folder_id?: number;
  name: string;
  description?: string;
  color?: string;
  source: FlashcardSource;
  source_reference?: string;
  is_public: boolean;
  new_cards_per_day: number;
  review_cards_per_day: number;
  card_count: number;
  due_count: number;
  new_count: number;
  learning_count: number;
  mastered_count: number;
  created_at: string;
  updated_at?: string;
  last_studied_at?: string;
}

export interface FlashcardDeckPreview {
  id: number;
  name: string;
  description?: string;
  color?: string;
  card_count: number;
  due_count: number;
  new_count: number;
  learning_count: number;
  updated_at?: string;
}

export interface Flashcard {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  front_image?: string;
  back_image?: string;
  card_type: FlashcardType;
  tags?: string[];
  hint?: string;
  extra_info?: string;
  sort_order: number;
  is_suspended: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FlashcardProgress {
  id: number;
  user_id: number;
  card_id: number;
  stability: number;
  difficulty: number;
  due?: string;
  last_review?: string;
  state: FlashcardState;
  reps: number;
  lapses: number;
  elapsed_days: number;
  scheduled_days: number;
  last_rating?: number;
  review_count: number;
  created_at: string;
  updated_at?: string;
}

export interface FlashcardWithProgress extends Flashcard {
  progress?: FlashcardProgress;
  state: FlashcardState;
  due?: string;
}

export interface FSRSSchedule {
  again: string;
  hard: string;
  good: string;
  easy: string;
  again_interval: string;
  hard_interval: string;
  good_interval: string;
  easy_interval: string;
}

export interface StudySessionStart {
  deck_id: number;
  include_new?: boolean;
  include_review?: boolean;
  include_learning?: boolean;
  max_cards?: number;
}

export interface StudySessionResponse {
  session_id: string;
  deck_id: number;
  deck_name: string;
  cards_due: number;
  cards_new: number;
  cards_learning: number;
  total_to_study: number;
  first_card?: StudySessionCard;
}

export interface StudySessionCard {
  card: FlashcardWithProgress;
  position: number;
  total_cards: number;
  schedule_preview: FSRSSchedule;
}

export interface FlashcardReviewSubmission {
  card_id: number;
  rating: 1 | 2 | 3 | 4; // 1=Again, 2=Hard, 3=Good, 4=Easy
  time_spent_ms?: number;
}

export interface FlashcardReviewResult {
  card_id: number;
  rating: number;
  state: FlashcardState;
  previous_state: FlashcardState;
  stability: number;
  difficulty: number;
  due: string;
  interval_days: number;
  is_correct: boolean;
}

export interface FlashcardCreate {
  deck_id: number;
  front: string;
  back: string;
  front_image?: string;
  back_image?: string;
  card_type?: FlashcardType;
  tags?: string[];
  hint?: string;
  extra_info?: string;
  sort_order?: number;
}

export interface FlashcardDeckCreate {
  name: string;
  description?: string;
  folder_id?: number;
  color?: string;
  is_public?: boolean;
  new_cards_per_day?: number;
  review_cards_per_day?: number;
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface DailyActivity {
  date: string;
  questions_answered: number;
  questions_correct: number;
  flashcards_reviewed: number;
  flashcards_correct: number;
  notes_created: number;
  notes_edited: number;
  study_time_minutes: number;
}

export interface WeeklyProgress {
  week_start: string;
  week_end: string;
  days: DailyActivity[];
  total_questions: number;
  total_flashcards: number;
  total_notes: number;
  total_study_time_minutes: number;
  accuracy_percentage: number;
}

export interface StudyStreak {
  current_streak: number;
  longest_streak: number;
  last_study_date?: string;
  streak_start_date?: string;
  is_active_today: boolean;
}

export interface StudentStats {
  user_id: number;
  streak: StudyStreak;
  total_study_days: number;
  total_study_time_hours: number;
  quiz_questions_attempted: number;
  quiz_accuracy: number;
  quiz_sessions_completed: number;
  flashcard_total_reviews: number;
  flashcard_retention_rate: number;
  flashcard_cards_mastered: number;
  notes_total: number;
  notes_total_words: number;
  weekly_activity: WeeklyProgress;
  member_since: string;
  last_active?: string;
  updated_at: string;
}

export interface QuizStats {
  total_questions_attempted: number;
  total_correct: number;
  accuracy_percentage: number;
  category_progress: CategoryProgress[];
  weakest_categories: CategoryProgress[];
}

export interface DeckProgress {
  deck_id: number;
  deck_name: string;
  total_cards: number;
  new_cards: number;
  learning_cards: number;
  review_cards: number;
  mastered_cards: number;
  due_today: number;
  retention_rate: number;
  last_studied?: string;
}

export interface FlashcardStats {
  total_reviews: number;
  retention_rate: number;
  deck_progress: DeckProgress[];
}

export interface NotesStats {
  total_notes: number;
  total_folders: number;
  total_words: number;
  total_characters: number;
  average_note_length: number;
}

export interface ActivityHeatmap {
  year: number;
  data: Record<string, {
    level: number;
    count: number;
    details: DailyActivity;
  }>;
  total_active_days: number;
}
