/**
 * Flashcards API Service
 *
 * Handles all flashcard-related API calls with FSRS support.
 */

import { apiClient } from './client';
import type {
  PaginatedResponse,
  FlashcardFolder,
  FlashcardDeck,
  FlashcardDeckPreview,
  Flashcard,
  FlashcardCreate,
  FlashcardDeckCreate,
  StudySessionStart,
  StudySessionResponse,
  FlashcardReviewSubmission,
  FlashcardReviewResult,
} from './types';

const BASE_PATH = '/student/flashcards';

export const flashcardsApi = {
  // ========================================================================
  // Folders
  // ========================================================================

  /**
   * Get folders
   */
  getFolders: (parentId?: number) =>
    apiClient.get<{ items: FlashcardFolder[]; total: number }>(
      `${BASE_PATH}/folders`,
      { parent_id: parentId }
    ),

  /**
   * Create folder
   */
  createFolder: (data: {
    name: string;
    parent_id?: number;
    color?: string;
    icon?: string;
    sort_order?: number;
  }) => apiClient.post<FlashcardFolder>(`${BASE_PATH}/folders`, data),

  /**
   * Get folder by ID
   */
  getFolder: (id: number) =>
    apiClient.get<FlashcardFolder>(`${BASE_PATH}/folders/${id}`),

  /**
   * Update folder
   */
  updateFolder: (id: number, data: Partial<{
    name: string;
    parent_id: number;
    color: string;
    icon: string;
    sort_order: number;
  }>) => apiClient.put<FlashcardFolder>(`${BASE_PATH}/folders/${id}`, data),

  /**
   * Delete folder
   */
  deleteFolder: (id: number) =>
    apiClient.delete<{ status: string; message: string }>(`${BASE_PATH}/folders/${id}`),

  // ========================================================================
  // Decks
  // ========================================================================

  /**
   * Get decks
   */
  getDecks: (params?: {
    folder_id?: number;
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<FlashcardDeckPreview>>(
    `${BASE_PATH}/decks`,
    params
  ),

  /**
   * Create deck
   */
  createDeck: (data: FlashcardDeckCreate) =>
    apiClient.post<FlashcardDeck>(`${BASE_PATH}/decks`, data),

  /**
   * Get deck by ID
   */
  getDeck: (id: number) =>
    apiClient.get<FlashcardDeck>(`${BASE_PATH}/decks/${id}`),

  /**
   * Update deck
   */
  updateDeck: (id: number, data: Partial<FlashcardDeckCreate>) =>
    apiClient.put<FlashcardDeck>(`${BASE_PATH}/decks/${id}`, data),

  /**
   * Delete deck
   */
  deleteDeck: (id: number) =>
    apiClient.delete<{ status: string; message: string }>(`${BASE_PATH}/decks/${id}`),

  /**
   * Get deck statistics
   */
  getDeckStats: (id: number) =>
    apiClient.get<{
      deck_id: number;
      total_cards: number;
      new_cards: number;
      learning_cards: number;
      review_cards: number;
      due_today: number;
      total_reviews: number;
      retention_rate: number;
      average_ease: number;
    }>(`${BASE_PATH}/decks/${id}/stats`),

  // ========================================================================
  // Cards
  // ========================================================================

  /**
   * Get cards in a deck
   */
  getCards: (deckId: number, params?: {
    include_suspended?: boolean;
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<Flashcard>>(
    `${BASE_PATH}/decks/${deckId}/cards`,
    params
  ),

  /**
   * Create card
   */
  createCard: (data: FlashcardCreate) =>
    apiClient.post<Flashcard>(`${BASE_PATH}/cards`, data),

  /**
   * Get card by ID
   */
  getCard: (id: number) =>
    apiClient.get<Flashcard>(`${BASE_PATH}/cards/${id}`),

  /**
   * Update card
   */
  updateCard: (id: number, data: Partial<Omit<FlashcardCreate, 'deck_id'>> & { deck_id?: number; is_suspended?: boolean }) =>
    apiClient.put<Flashcard>(`${BASE_PATH}/cards/${id}`, data),

  /**
   * Delete card
   */
  deleteCard: (id: number) =>
    apiClient.delete<{ status: string; message: string }>(`${BASE_PATH}/cards/${id}`),

  // ========================================================================
  // Study Sessions (FSRS)
  // ========================================================================

  /**
   * Start a study session
   */
  startStudySession: (config: StudySessionStart) =>
    apiClient.post<StudySessionResponse>(`${BASE_PATH}/study/start`, config),

  /**
   * Submit a card review (FSRS rating)
   */
  submitReview: (review: FlashcardReviewSubmission) =>
    apiClient.post<FlashcardReviewResult>(`${BASE_PATH}/study/review`, review),

  /**
   * Submit multiple reviews (for offline sync)
   */
  submitBulkReviews: (reviews: FlashcardReviewSubmission[]) =>
    apiClient.post<{
      total: number;
      successful: number;
      failed: number;
      results: Array<{
        card_id: number;
        status: 'success' | 'error';
        result?: FlashcardReviewResult;
        error?: string;
      }>;
    }>(`${BASE_PATH}/study/bulk-review`, reviews),
};
