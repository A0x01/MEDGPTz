/**
 * QuizResults - API Integrated Version
 *
 * Display quiz results after completion.
 */

import React from 'react';
import {
  Trophy,
  Target,
  Clock,
  RotateCcw,
  Home,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Minus
} from 'lucide-react';
import { QuizResultsData } from './QuizInterfaceAPI';

interface QuizResultsProps {
  results: QuizResultsData;
  onRetry: (categoryId: number, specialtyId: number) => void;
  onRetryIncorrect: (categoryId: number, specialtyId: number) => void;
  onHome: () => void;
}

export function QuizResultsAPI({ results, onRetry, onRetryIncorrect, onHome }: QuizResultsProps) {
  const {
    attemptId,
    questions,
    answers,
    flagged,
    timeSpent,
    score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    skippedAnswers
  } = results;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use actual values from API, not computed
  const incorrectCount = wrongAnswers;
  const skippedCount = skippedAnswers;

  // Get performance rating
  const getPerformanceRating = () => {
    if (score >= 90) return { label: 'Excellent!', color: 'var(--color-success)', emoji: '🎉' };
    if (score >= 80) return { label: 'Great Job!', color: 'var(--color-success)', emoji: '👏' };
    if (score >= 70) return { label: 'Good Work!', color: 'var(--color-primary)', emoji: '👍' };
    if (score >= 60) return { label: 'Keep Practicing', color: 'var(--color-warning)', emoji: '📚' };
    return { label: 'Needs Improvement', color: 'var(--color-danger)', emoji: '💪' };
  };

  const performance = getPerformanceRating();

  // Get category ID from first question (all questions in session are from same category)
  const categoryId = questions[0]?.category_id ?? 0;
  // We'll need to pass specialty ID through or get it from the attempt
  const specialtyId = 0; // This would need to be passed through results

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-4xl mb-4">{performance.emoji}</div>
            <h1 className="text-[var(--color-text)] mb-2" style={{ color: performance.color }}>
              {performance.label}
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Quiz completed! Here's how you did.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Score Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="var(--color-border)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={performance.color}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-[var(--color-text)]">{Math.round(score)}%</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Score</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 text-[var(--color-success)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--color-success)]">{correctAnswers}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Correct</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center mx-auto mb-2">
                <X className="w-6 h-6 text-[var(--color-danger)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--color-danger)]">{incorrectCount}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Incorrect</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center mx-auto mb-2">
                <Minus className="w-6 h-6 text-[var(--color-warning)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--color-warning)]">{skippedCount}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Skipped</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-text-secondary)]/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-[var(--color-text-secondary)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--color-text)]">{formatTime(timeSpent)}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Time</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-[var(--color-text)]">{Math.round(score)}%</div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">Questions</span>
            </div>
            <div className="text-2xl font-bold text-[var(--color-text)]">
              {totalQuestions}
            </div>
          </div>
        </div>

        {/* Flagged Questions */}
        {flagged.size > 0 && (
          <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
              <span className="font-medium text-[var(--color-text)]">Flagged Questions</span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              You flagged {flagged.size} question{flagged.size > 1 ? 's' : ''} for review.
              Consider creating flashcards for these topics.
            </p>
          </div>
        )}

        {/* Question Review Summary */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 mb-8">
          <h3 className="text-[var(--color-text)] mb-4">Question Summary</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((question, index) => {
              const answer = answers.get(question.id);
              const isCorrect = answer?.is_correct ?? false;
              const isAnswered = answers.has(question.id);
              const isFlagged = flagged.has(question.id);

              return (
                <div
                  key={question.id}
                  className={`
                    relative w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    ${!isAnswered ? 'bg-[var(--color-text-secondary)]/10 text-[var(--color-text-secondary)]' :
                      isCorrect ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' :
                      'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}
                  `}
                >
                  {index + 1}
                  {isFlagged && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onHome}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-background)] transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          {incorrectCount > 0 && (
            <button
              onClick={() => onRetryIncorrect(categoryId, specialtyId)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-warning)] text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
              Review Incorrect ({incorrectCount})
            </button>
          )}

          <button
            onClick={() => onRetry(categoryId, specialtyId)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
