// MedQuiz Type Definitions

export interface Topic {
  id: string;
  name: string;
  parentId: string | null;
  level: number; // 0 = specialty, 1 = subspecialty, 2 = topic, etc.
  questionCount: number;
  children?: Topic[];
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  optionExplanations: string[]; // explanation for each option
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  category?: string;
}

export interface QuizAttempt {
  id: string;
  topicId: string;
  questions: Question[];
  answers: (number | null)[];
  flagged: boolean[];
  startTime: number;
  endTime?: number;
  mode: QuizMode;
  score?: number;
}

export type QuizMode = 'standard' | 'timed' | 'review' | 'incorrect';

export interface UserProgress {
  topicId: string;
  totalAttempts: number;
  correctAnswers: number;
  totalQuestions: number;
  lastAttemptDate: string;
  averageScore: number;
  weakQuestions: string[]; // question IDs
}

export interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  favoriteTopics: string[];
  recentTopics: string[];
  xp: number;
  level: number;
}