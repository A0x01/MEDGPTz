/**
 * MedQuizHome - API Integrated Version
 *
 * Home screen for MedQuiz with API-powered statistics.
 */

import React, { useEffect, useState } from 'react';
import { Play, Trophy, Target, TrendingUp, Clock, Star, BookOpen, Zap, Loader2 } from 'lucide-react';
import { statsApi, quizApi } from '../../api';
import type { StudentStats, QuizSpecialty, QuizAttempt } from '../../api/types';

interface MedQuizHomeProps {
  onNavigateToExplorer: () => void;
  onStartQuickQuiz: (categoryId: number, specialtyId: number) => void;
}

export function MedQuizHomeAPI({ onNavigateToExplorer, onStartQuickQuiz }: MedQuizHomeProps) {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [specialties, setSpecialties] = useState<QuizSpecialty[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, specialtiesResponse, attemptsResponse] = await Promise.all([
          statsApi.getStats(),
          quizApi.getSpecialties({ active_only: true, page_size: 10 }),
          quizApi.getAttempts({ page_size: 5 }),
        ]);

        setStats(statsResponse);
        setSpecialties(specialtiesResponse.items);
        setRecentAttempts(attemptsResponse.items);
      } catch (err) {
        console.error('Failed to load quiz home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  const userLevel = stats ? Math.floor(stats.quiz_questions_attempted / 100) + 1 : 1;
  const xpInLevel = stats ? (stats.quiz_questions_attempted % 100) * 10 : 0;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[var(--color-text)] mb-2">MedQuiz</h1>
              <p className="text-[var(--color-text-secondary)]">
                Master medical knowledge through targeted practice
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-[var(--color-text-secondary)]">Level {userLevel}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-32 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)]"
                      style={{ width: `${xpInLevel}%` }}
                    />
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">{xpInLevel}/1000 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <div className="text-2xl text-[var(--color-text)]">{stats?.quiz_sessions_completed ?? 0}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Quizzes Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <div>
                <div className="text-2xl text-[var(--color-text)]">{Math.round(stats?.quiz_accuracy ?? 0)}%</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Overall Accuracy</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[var(--color-warning)]" />
              </div>
              <div>
                <div className="text-2xl text-[var(--color-text)]">{stats?.streak.current_streak ?? 0}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--color-danger)]" />
              </div>
              <div>
                <div className="text-2xl text-[var(--color-text)]">{stats?.quiz_questions_attempted ?? 0}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Questions Attempted</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-[var(--color-text)] mb-4">Quick Start</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onNavigateToExplorer}
                  className="flex flex-col items-center gap-3 p-6 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Play className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">Browse Topics</div>
                    <div className="text-sm opacity-80">Choose a specific topic</div>
                  </div>
                </button>

                <button
                  onClick={onNavigateToExplorer}
                  className="flex flex-col items-center gap-3 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background)] transition-colors"
                >
                  <TrendingUp className="w-8 h-8 text-[var(--color-primary)]" />
                  <div className="text-center">
                    <div className="font-medium">Practice Weak Areas</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Focus on missed questions</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-[var(--color-text)] mb-4">Medical Specialties</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specialties.slice(0, 6).map(specialty => (
                  <button
                    key={specialty.id}
                    onClick={onNavigateToExplorer}
                    className="flex items-center gap-3 p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors text-left"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: specialty.color || '#3B82F6' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-text)] truncate">
                        {specialty.display_name}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {specialty.question_count} questions
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {specialties.length > 6 && (
                <button
                  onClick={onNavigateToExplorer}
                  className="w-full mt-4 py-2 text-sm text-[var(--color-primary)] hover:underline"
                >
                  View all {specialties.length} specialties
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Streak */}
            {stats?.streak && (
              <div className="bg-gradient-to-br from-[var(--color-warning)]/10 to-orange-500/10 border border-[var(--color-warning)]/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-warning)] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[var(--color-text)]">
                      {stats.streak.current_streak}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Day Streak</div>
                  </div>
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {stats.streak.is_active_today
                    ? "You've studied today! Keep it up!"
                    : "Study today to maintain your streak!"}
                </div>
                <div className="mt-3 text-xs text-[var(--color-text-secondary)]">
                  Longest streak: {stats.streak.longest_streak} days
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {recentAttempts.length > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                <h3 className="text-[var(--color-text)] mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentAttempts.map(attempt => {
                    const scorePercent = attempt.score_percentage ?? 0;
                    return (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
                      >
                        <div>
                          <div className="text-sm text-[var(--color-text)]">
                            Quiz #{attempt.id}
                          </div>
                          <div className="text-xs text-[var(--color-text-secondary)]">
                            {attempt.total_questions} questions
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${
                          scorePercent >= 80 ? 'text-[var(--color-success)]' :
                          scorePercent >= 60 ? 'text-[var(--color-warning)]' :
                          'text-[var(--color-danger)]'
                        }`}>
                          {Math.round(scorePercent)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Study Tips */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="text-[var(--color-text)] mb-4">Tips for Success</h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-[var(--color-warning)] mt-0.5 flex-shrink-0" />
                  <span>Practice consistently, even if just 10 questions a day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-[var(--color-warning)] mt-0.5 flex-shrink-0" />
                  <span>Review explanations for both correct and incorrect answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-[var(--color-warning)] mt-0.5 flex-shrink-0" />
                  <span>Create flashcards from questions you miss</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
