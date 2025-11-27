/**
 * Quiz Hooks
 *
 * React hooks for quiz functionality.
 */

import { useState, useCallback } from 'react';
import { quizApi } from '../api';
import { useApi, useMutation, usePaginatedApi } from './useApi';
import type {
  QuizSpecialty,
  QuizCategory,
  QuizSessionStart,
  QuizSessionResponse,
  AnswerSubmission,
  AnswerResult,
  QuizAttempt,
} from '../api/types';

/**
 * Hook for fetching specialties
 */
export function useSpecialties(activeOnly = true) {
  return usePaginatedApi<QuizSpecialty>(
    (page, pageSize) => quizApi.getSpecialties({ page, page_size: pageSize, active_only: activeOnly })
  );
}

/**
 * Hook for fetching categories
 */
export function useCategories(specialtyId?: number, activeOnly = true) {
  return usePaginatedApi<QuizCategory>(
    (page, pageSize) => quizApi.getCategories({
      specialty_id: specialtyId,
      page,
      page_size: pageSize,
      active_only: activeOnly,
    })
  );
}

/**
 * Hook for managing a quiz session
 */
export function useQuizSession() {
  const [session, setSession] = useState<QuizSessionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startSession = useCallback(async (config: QuizSessionStart) => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizApi.startSession(config);
      setSession(response);
      setCurrentIndex(0);
      setAnswers(new Map());
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (answer: AnswerSubmission) => {
    if (!session) throw new Error('No active session');

    setLoading(true);
    try {
      const result = await quizApi.submitAnswer(session.attempt_id, answer);
      setAnswers(prev => new Map(prev).set(answer.question_id, result));
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const completeSession = useCallback(async () => {
    if (!session) throw new Error('No active session');

    setLoading(true);
    try {
      const result = await quizApi.completeSession(session.attempt_id);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const goToQuestion = useCallback((index: number) => {
    if (session && index >= 0 && index < session.questions.length) {
      setCurrentIndex(index);
    }
  }, [session]);

  const nextQuestion = useCallback(() => {
    if (session && currentIndex < session.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [session, currentIndex]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const flagQuestion = useCallback(async (questionId: number, flagged = true) => {
    if (!session) throw new Error('No active session');
    return quizApi.flagQuestion(session.attempt_id, questionId, flagged);
  }, [session]);

  const resetSession = useCallback(() => {
    setSession(null);
    setCurrentIndex(0);
    setAnswers(new Map());
    setError(null);
  }, []);

  return {
    session,
    currentQuestion: session?.questions[currentIndex] ?? null,
    currentIndex,
    totalQuestions: session?.questions.length ?? 0,
    answers,
    loading,
    error,
    startSession,
    submitAnswer,
    completeSession,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    flagQuestion,
    resetSession,
    isAnswered: (questionId: number) => answers.has(questionId),
    getAnswer: (questionId: number) => answers.get(questionId),
  };
}

/**
 * Hook for quiz attempt history
 */
export function useQuizAttempts(params?: {
  specialty_id?: number;
  category_id?: number;
}) {
  return usePaginatedApi<QuizAttempt>(
    (page, pageSize) => quizApi.getAttempts({
      ...params,
      page,
      page_size: pageSize,
    })
  );
}

/**
 * Hook for category progress
 */
export function useCategoryProgress(categoryId: number) {
  return useApi(
    () => quizApi.getCategoryProgress(categoryId),
    [categoryId]
  );
}
