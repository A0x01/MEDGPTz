/**
 * Stats API Service
 *
 * Handles all statistics and progress-related API calls.
 */

import { apiClient } from './client';
import type {
  StudentStats,
  DailyActivity,
  WeeklyProgress,
  StudyStreak,
  QuizStats,
  FlashcardStats,
  NotesStats,
  CategoryProgress,
  DeckProgress,
  ActivityHeatmap,
  PaginatedResponse,
} from './types';

const BASE_PATH = '/student/stats';

export const statsApi = {
  /**
   * Get comprehensive student statistics
   */
  getStats: () =>
    apiClient.get<StudentStats>(BASE_PATH),

  /**
   * Get daily activity for a date range
   */
  getDailyActivity: (params?: {
    start_date?: string;
    end_date?: string;
  }) => apiClient.get<{
    start_date: string;
    end_date: string;
    days: DailyActivity[];
  }>(`${BASE_PATH}/daily`, params),

  /**
   * Get weekly progress summary
   */
  getWeeklyProgress: (weekOf?: string) =>
    apiClient.get<WeeklyProgress>(`${BASE_PATH}/weekly`, { week_of: weekOf }),

  /**
   * Get study streak information
   */
  getStreak: () =>
    apiClient.get<StudyStreak>(`${BASE_PATH}/streak`),

  /**
   * Get detailed quiz statistics
   */
  getQuizStats: () =>
    apiClient.get<QuizStats>(`${BASE_PATH}/quiz`),

  /**
   * Get detailed flashcard statistics
   */
  getFlashcardStats: () =>
    apiClient.get<FlashcardStats>(`${BASE_PATH}/flashcards`),

  /**
   * Get notes statistics
   */
  getNotesStats: () =>
    apiClient.get<NotesStats>(`${BASE_PATH}/notes`),

  /**
   * Get quiz progress by category
   */
  getCategoryProgress: (params?: {
    specialty_id?: number;
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<CategoryProgress>>(
    `${BASE_PATH}/categories`,
    params
  ),

  /**
   * Get flashcard progress by deck
   */
  getDeckProgress: (params?: {
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<DeckProgress>>(
    `${BASE_PATH}/decks`,
    params
  ),

  /**
   * Get activity heatmap data for a year
   */
  getHeatmap: (year?: number) =>
    apiClient.get<ActivityHeatmap>(`${BASE_PATH}/heatmap`, { year }),
};
