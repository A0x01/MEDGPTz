/**
 * Quiz API Service
 *
 * Handles all quiz-related API calls.
 */

import { apiClient } from './client';
import type {
  PaginatedResponse,
  QuizSpecialty,
  QuizCategory,
  QuizQuestion,
  QuizQuestionWithOptions,
  QuizSessionStart,
  QuizSessionResponse,
  AnswerSubmission,
  AnswerResult,
  QuizAttempt,
  CategoryProgress,
} from './types';

const BASE_PATH = '/student/quiz';

export const quizApi = {
  // ========================================================================
  // Specialties
  // ========================================================================

  /**
   * Get all quiz specialties
   */
  getSpecialties: (params?: {
    page?: number;
    page_size?: number;
    active_only?: boolean;
  }) => apiClient.get<PaginatedResponse<QuizSpecialty>>(
    `${BASE_PATH}/specialties`,
    params
  ),

  /**
   * Get specialty by ID
   */
  getSpecialty: (id: number) =>
    apiClient.get<QuizSpecialty>(`${BASE_PATH}/specialties/${id}`),

  // ========================================================================
  // Categories
  // ========================================================================

  /**
   * Get quiz categories
   */
  getCategories: (params?: {
    specialty_id?: number;
    page?: number;
    page_size?: number;
    active_only?: boolean;
  }) => apiClient.get<PaginatedResponse<QuizCategory>>(
    `${BASE_PATH}/categories`,
    params
  ),

  /**
   * Get category by ID
   */
  getCategory: (id: number) =>
    apiClient.get<QuizCategory>(`${BASE_PATH}/categories/${id}`),

  // ========================================================================
  // Questions
  // ========================================================================

  /**
   * Get quiz questions (without answers for browsing)
   */
  getQuestions: (params?: {
    category_id?: number;
    specialty_id?: number;
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<QuizQuestion>>(
    `${BASE_PATH}/questions`,
    params
  ),

  // ========================================================================
  // Quiz Sessions
  // ========================================================================

  /**
   * Start a new quiz session
   */
  startSession: (config: QuizSessionStart) =>
    apiClient.post<QuizSessionResponse>(`${BASE_PATH}/session/start`, config),

  /**
   * Submit an answer during a quiz session
   */
  submitAnswer: (attemptId: number, answer: AnswerSubmission) =>
    apiClient.post<AnswerResult>(
      `${BASE_PATH}/session/${attemptId}/answer`,
      answer
    ),

  /**
   * Complete a quiz session
   */
  completeSession: (attemptId: number) =>
    apiClient.post<QuizAttempt>(`${BASE_PATH}/session/${attemptId}/complete`),

  /**
   * Flag a question for review
   */
  flagQuestion: (attemptId: number, questionId: number, flagged = true) =>
    apiClient.post<{ status: string; flagged: boolean }>(
      `${BASE_PATH}/session/${attemptId}/flag/${questionId}`,
      undefined
    ),

  // ========================================================================
  // Attempt History
  // ========================================================================

  /**
   * Get user's quiz attempts
   */
  getAttempts: (params?: {
    specialty_id?: number;
    category_id?: number;
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<QuizAttempt>>(
    `${BASE_PATH}/attempts`,
    params
  ),

  /**
   * Get detailed attempt
   */
  getAttempt: (attemptId: number) =>
    apiClient.get<QuizAttempt>(`${BASE_PATH}/attempts/${attemptId}`),

  // ========================================================================
  // Progress
  // ========================================================================

  /**
   * Get progress for a category
   */
  getCategoryProgress: (categoryId: number) =>
    apiClient.get<CategoryProgress>(`${BASE_PATH}/progress/category/${categoryId}`),
};
