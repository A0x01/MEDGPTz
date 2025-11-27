/**
 * Statistics Hooks
 *
 * React hooks for student statistics and progress tracking.
 */

import { useMemo } from 'react';
import { statsApi } from '../api';
import { useApi, usePaginatedApi } from './useApi';
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
} from '../api/types';

/**
 * Hook for comprehensive student statistics
 */
export function useStudentStats() {
  return useApi(() => statsApi.getStats(), []);
}

/**
 * Hook for daily activity
 */
export function useDailyActivity(startDate?: string, endDate?: string) {
  return useApi(
    () => statsApi.getDailyActivity({ start_date: startDate, end_date: endDate }),
    [startDate, endDate]
  );
}

/**
 * Hook for weekly progress
 */
export function useWeeklyProgress(weekOf?: string) {
  return useApi(
    () => statsApi.getWeeklyProgress(weekOf),
    [weekOf]
  );
}

/**
 * Hook for study streak
 */
export function useStudyStreak() {
  const result = useApi(() => statsApi.getStreak(), []);

  const streakInfo = useMemo(() => {
    if (!result.data) return null;

    const { current_streak, longest_streak, is_active_today, last_study_date } = result.data;

    return {
      current: current_streak,
      longest: longest_streak,
      isActiveToday: is_active_today,
      lastStudyDate: last_study_date,
      needsStudyToday: !is_active_today,
      streakAtRisk: current_streak > 0 && !is_active_today,
    };
  }, [result.data]);

  return {
    ...result,
    streakInfo,
  };
}

/**
 * Hook for quiz statistics
 */
export function useQuizStats() {
  const result = useApi(() => statsApi.getQuizStats(), []);

  const summary = useMemo(() => {
    if (!result.data) return null;

    return {
      totalAttempted: result.data.total_questions_attempted,
      totalCorrect: result.data.total_correct,
      accuracy: result.data.accuracy_percentage,
      categoryCount: result.data.category_progress.length,
      weakCategories: result.data.weakest_categories,
    };
  }, [result.data]);

  return {
    ...result,
    summary,
  };
}

/**
 * Hook for flashcard statistics
 */
export function useFlashcardStats() {
  const result = useApi(() => statsApi.getFlashcardStats(), []);

  const summary = useMemo(() => {
    if (!result.data) return null;

    const totalCards = result.data.deck_progress.reduce(
      (sum, deck) => sum + deck.total_cards, 0
    );
    const masteredCards = result.data.deck_progress.reduce(
      (sum, deck) => sum + deck.mastered_cards, 0
    );
    const dueToday = result.data.deck_progress.reduce(
      (sum, deck) => sum + deck.due_today, 0
    );

    return {
      totalReviews: result.data.total_reviews,
      retentionRate: result.data.retention_rate,
      totalCards,
      masteredCards,
      masteryPercentage: totalCards > 0 ? (masteredCards / totalCards) * 100 : 0,
      dueToday,
      deckCount: result.data.deck_progress.length,
    };
  }, [result.data]);

  return {
    ...result,
    summary,
  };
}

/**
 * Hook for notes statistics
 */
export function useNotesStatsHook() {
  return useApi(() => statsApi.getNotesStats(), []);
}

/**
 * Hook for category progress with pagination
 */
export function useCategoryProgressList(specialtyId?: number) {
  return usePaginatedApi<CategoryProgress>(
    (page, pageSize) => statsApi.getCategoryProgress({
      specialty_id: specialtyId,
      page,
      page_size: pageSize,
    })
  );
}

/**
 * Hook for deck progress with pagination
 */
export function useDeckProgressList() {
  return usePaginatedApi<DeckProgress>(
    (page, pageSize) => statsApi.getDeckProgress({
      page,
      page_size: pageSize,
    })
  );
}

/**
 * Hook for activity heatmap
 */
export function useActivityHeatmap(year?: number) {
  const currentYear = new Date().getFullYear();
  const targetYear = year ?? currentYear;

  const result = useApi(
    () => statsApi.getHeatmap(targetYear),
    [targetYear]
  );

  const heatmapData = useMemo(() => {
    if (!result.data) return null;

    // Transform data for visualization
    const entries = Object.entries(result.data.data).map(([date, info]) => ({
      date,
      level: info.level,
      count: info.count,
      details: info.details,
    }));

    return {
      year: result.data.year,
      totalActiveDays: result.data.total_active_days,
      entries,
      maxLevel: Math.max(...entries.map(e => e.level), 0),
      maxCount: Math.max(...entries.map(e => e.count), 0),
    };
  }, [result.data]);

  return {
    ...result,
    heatmapData,
  };
}

/**
 * Combined dashboard stats hook
 */
export function useDashboardStats() {
  const studentStats = useStudentStats();
  const streak = useStudyStreak();
  const quizStats = useQuizStats();
  const flashcardStats = useFlashcardStats();

  const isLoading =
    studentStats.loading ||
    streak.loading ||
    quizStats.loading ||
    flashcardStats.loading;

  const hasError =
    studentStats.error ||
    streak.error ||
    quizStats.error ||
    flashcardStats.error;

  const refetchAll = async () => {
    await Promise.all([
      studentStats.refetch(),
      streak.refetch(),
      quizStats.refetch(),
      flashcardStats.refetch(),
    ]);
  };

  return {
    studentStats: studentStats.data,
    streak: streak.streakInfo,
    quizSummary: quizStats.summary,
    flashcardSummary: flashcardStats.summary,
    isLoading,
    hasError,
    refetchAll,
  };
}
