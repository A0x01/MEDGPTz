/**
 * Flashcards Hooks
 *
 * React hooks for flashcard functionality with FSRS support.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { flashcardsApi } from '../api';
import { useApi, useMutation, usePaginatedApi } from './useApi';
import type {
  FlashcardFolder,
  FlashcardDeckPreview,
  FlashcardDeck,
  Flashcard,
  FlashcardCreate,
  FlashcardDeckCreate,
  StudySessionStart,
  StudySessionResponse,
  StudySessionCard,
  FlashcardReviewSubmission,
  FlashcardReviewResult,
} from '../api/types';

/**
 * Hook for fetching flashcard folders
 */
export function useFlashcardFolders(parentId?: number) {
  return useApi(
    () => flashcardsApi.getFolders(parentId),
    [parentId]
  );
}

/**
 * Hook for folder CRUD operations
 */
export function useFlashcardFolderCrud() {
  const createMutation = useMutation<FlashcardFolder, {
    name: string;
    parent_id?: number;
    color?: string;
    icon?: string;
    sort_order?: number;
  }>(flashcardsApi.createFolder);

  const updateMutation = useMutation<FlashcardFolder, {
    id: number;
    data: Partial<{
      name: string;
      parent_id: number;
      color: string;
      icon: string;
      sort_order: number;
    }>;
  }>(({ id, data }) => flashcardsApi.updateFolder(id, data));

  const deleteMutation = useMutation<{ status: string; message: string }, number>(
    flashcardsApi.deleteFolder
  );

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}

/**
 * Hook for fetching decks with pagination
 */
export function useFlashcardDecks(folderId?: number) {
  return usePaginatedApi<FlashcardDeckPreview>(
    (page, pageSize) => flashcardsApi.getDecks({
      folder_id: folderId,
      page,
      page_size: pageSize,
    })
  );
}

/**
 * Hook for a single deck
 */
export function useFlashcardDeck(deckId: number) {
  return useApi(
    () => flashcardsApi.getDeck(deckId),
    [deckId]
  );
}

/**
 * Hook for deck statistics
 */
export function useDeckStats(deckId: number) {
  return useApi(
    () => flashcardsApi.getDeckStats(deckId),
    [deckId]
  );
}

/**
 * Hook for deck CRUD operations
 */
export function useDeckCrud() {
  const createMutation = useMutation<FlashcardDeck, FlashcardDeckCreate>(
    flashcardsApi.createDeck
  );

  const updateMutation = useMutation<FlashcardDeck, { id: number; data: Partial<FlashcardDeckCreate> }>(
    ({ id, data }) => flashcardsApi.updateDeck(id, data)
  );

  const deleteMutation = useMutation<{ status: string; message: string }, number>(
    flashcardsApi.deleteDeck
  );

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}

/**
 * Hook for fetching cards in a deck
 */
export function useFlashcards(deckId: number, includeSuspended = false) {
  return usePaginatedApi<Flashcard>(
    (page, pageSize) => flashcardsApi.getCards(deckId, {
      include_suspended: includeSuspended,
      page,
      page_size: pageSize,
    })
  );
}

/**
 * Hook for card CRUD operations
 */
export function useCardCrud() {
  const createMutation = useMutation<Flashcard, FlashcardCreate>(
    flashcardsApi.createCard
  );

  const updateMutation = useMutation<Flashcard, {
    id: number;
    data: Partial<Omit<FlashcardCreate, 'deck_id'>> & { deck_id?: number; is_suspended?: boolean };
  }>(({ id, data }) => flashcardsApi.updateCard(id, data));

  const deleteMutation = useMutation<{ status: string; message: string }, number>(
    flashcardsApi.deleteCard
  );

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}

/**
 * Hook for FSRS study session
 */
export function useStudySession() {
  const [session, setSession] = useState<StudySessionResponse | null>(null);
  const [currentCard, setCurrentCard] = useState<StudySessionCard | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);

  // Track time spent on current card
  const cardStartTime = useRef<number>(Date.now());

  const startSession = useCallback(async (config: StudySessionStart) => {
    setLoading(true);
    setError(null);
    try {
      const response = await flashcardsApi.startStudySession(config);
      setSession(response);
      setCurrentCard(response.first_card ?? null);
      setReviewedCount(0);
      setCorrectCount(0);
      setIsShowingAnswer(false);
      cardStartTime.current = Date.now();
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const showAnswer = useCallback(() => {
    setIsShowingAnswer(true);
  }, []);

  const submitReview = useCallback(async (rating: 1 | 2 | 3 | 4) => {
    if (!currentCard) throw new Error('No current card');

    const timeSpent = Date.now() - cardStartTime.current;
    setLoading(true);

    try {
      const result = await flashcardsApi.submitReview({
        card_id: currentCard.card.id,
        rating,
        time_spent_ms: timeSpent,
      });

      setReviewedCount(prev => prev + 1);
      if (result.is_correct) {
        setCorrectCount(prev => prev + 1);
      }

      // Reset for next card
      setIsShowingAnswer(false);
      cardStartTime.current = Date.now();

      // Check if there are more cards
      if (currentCard.position < currentCard.total_cards) {
        // Fetch next card by starting a new mini-session
        // In a real implementation, the backend would return the next card
        // For now, we'll end the session when all cards are reviewed
        if (session) {
          const nextResponse = await flashcardsApi.startStudySession({
            deck_id: session.deck_id,
            max_cards: 1,
          });
          if (nextResponse.first_card) {
            setCurrentCard({
              ...nextResponse.first_card,
              position: currentCard.position + 1,
              total_cards: currentCard.total_cards,
            });
          } else {
            setCurrentCard(null);
          }
        }
      } else {
        setCurrentCard(null);
      }

      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCard, session]);

  const endSession = useCallback(() => {
    setSession(null);
    setCurrentCard(null);
    setReviewedCount(0);
    setCorrectCount(0);
    setIsShowingAnswer(false);
  }, []);

  return {
    session,
    currentCard,
    reviewedCount,
    correctCount,
    loading,
    error,
    isShowingAnswer,
    isComplete: session !== null && currentCard === null,
    progress: session ? {
      reviewed: reviewedCount,
      total: session.total_to_study,
      accuracy: reviewedCount > 0 ? (correctCount / reviewedCount) * 100 : 0,
    } : null,
    startSession,
    showAnswer,
    submitReview,
    endSession,
  };
}

/**
 * Hook for bulk review sync (for offline support)
 */
export function useBulkReviewSync() {
  const [pendingReviews, setPendingReviews] = useState<FlashcardReviewSubmission[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addReview = useCallback((review: FlashcardReviewSubmission) => {
    setPendingReviews(prev => [...prev, review]);
  }, []);

  const syncReviews = useCallback(async () => {
    if (pendingReviews.length === 0) return;

    setSyncing(true);
    setError(null);

    try {
      const result = await flashcardsApi.submitBulkReviews(pendingReviews);

      // Keep failed reviews for retry
      const failedCardIds = result.results
        .filter(r => r.status === 'error')
        .map(r => r.card_id);

      setPendingReviews(prev =>
        prev.filter(r => failedCardIds.includes(r.card_id))
      );

      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [pendingReviews]);

  const clearPending = useCallback(() => {
    setPendingReviews([]);
  }, []);

  return {
    pendingReviews,
    pendingCount: pendingReviews.length,
    syncing,
    error,
    addReview,
    syncReviews,
    clearPending,
  };
}
