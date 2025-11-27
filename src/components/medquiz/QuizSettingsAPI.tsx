/**
 * QuizSettings - API Integrated Version
 *
 * Configure quiz settings before starting.
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, Hash, Shuffle, Loader2 } from 'lucide-react';
import { quizApi } from '../../api';
import type { QuizCategory, QuizMode } from '../../api/types';

interface QuizSettingsProps {
  categoryId: number;
  specialtyId: number;
  onStart: (mode: QuizMode, questionCount: number, timeLimitMinutes?: number) => void;
  onClose: () => void;
}

export function QuizSettingsAPI({ categoryId, specialtyId, onStart, onClose }: QuizSettingsProps) {
  const [category, setCategory] = useState<QuizCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<QuizMode>('standard');
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | undefined>(undefined);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await quizApi.getCategory(categoryId);
        setCategory(response);
        // Set default question count to min of 20 or total questions
        setQuestionCount(Math.min(20, response.question_count));
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId]);

  const handleStart = () => {
    onStart(mode, questionCount, mode === 'timed' ? timeLimitMinutes : undefined);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8">
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const maxQuestions = category?.question_count ?? 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-[var(--color-text)]">Quiz Settings</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {category?.display_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Settings */}
        <div className="p-6 space-y-6">
          {/* Mode Selection */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text)] mb-3 block">
              Quiz Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'standard', label: 'Standard', desc: 'Immediate feedback' },
                { id: 'timed', label: 'Timed', desc: 'Complete under time pressure' },
                { id: 'review', label: 'Review', desc: 'See all answers first' },
                { id: 'random', label: 'Random', desc: 'Shuffle all questions' },
              ].map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setMode(id as QuizMode)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    mode === id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <div className="text-sm font-medium text-[var(--color-text)]">{label}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text)] mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max={maxQuestions}
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-[var(--color-text)] w-16 text-right">
                {questionCount} / {maxQuestions}
              </span>
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--color-text-secondary)]">
              <span>5 min</span>
              <span>{maxQuestions} max</span>
            </div>
          </div>

          {/* Time Limit (for timed mode) */}
          {mode === 'timed' && (
            <div>
              <label className="text-sm font-medium text-[var(--color-text)] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Limit
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => setTimeLimitMinutes(minutes)}
                    className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                      timeLimitMinutes === minutes
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text)] mb-3 flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-text)]">Shuffle question order</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-text)]">Shuffle answer options</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)]">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-background)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
