import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import { QuizMode } from '../../types/medquiz';

interface QuizSettingsProps {
  topicName: string;
  totalQuestions: number;
  onStart: (config: QuizConfig) => void;
  onClose: () => void;
}

export interface QuizConfig {
  mode: QuizMode;
  questionCount: number;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  shuffle: boolean;
}

export function QuizSettings({ topicName, totalQuestions, onStart, onClose }: QuizSettingsProps) {
  const [config, setConfig] = useState<QuizConfig>({
    mode: 'standard',
    questionCount: Math.min(20, totalQuestions),
    difficulty: 'all',
    shuffle: true
  });

  const handleStart = () => {
    onStart(config);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-surface)] z-10">
          <div>
            <h2 className="text-[var(--color-text)] mb-1">Custom Quiz Settings</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">{topicName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quiz Mode */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
              Quiz Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfig({ ...config, mode: 'standard' })}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  config.mode === 'standard'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div className="font-medium text-[var(--color-text)] mb-1">Standard</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Self-paced with immediate feedback
                </div>
              </button>

              <button
                onClick={() => setConfig({ ...config, mode: 'timed' })}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  config.mode === 'timed'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div className="font-medium text-[var(--color-text)] mb-1">Timed</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Simulate exam conditions
                </div>
              </button>

              <button
                onClick={() => setConfig({ ...config, mode: 'review' })}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  config.mode === 'review'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div className="font-medium text-[var(--color-text)] mb-1">Review</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  See answers while studying
                </div>
              </button>

              <button
                onClick={() => setConfig({ ...config, mode: 'incorrect' })}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  config.mode === 'incorrect'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div className="font-medium text-[var(--color-text)] mb-1">Incorrect Only</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Focus on weak areas
                </div>
              </button>
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max={Math.min(totalQuestions, 50)}
                step="1"
                value={config.questionCount}
                onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="w-16 text-center">
                <input
                  type="number"
                  min="5"
                  max={Math.min(totalQuestions, 50)}
                  value={config.questionCount}
                  onChange={(e) => setConfig({ ...config, questionCount: Math.min(parseInt(e.target.value) || 5, Math.min(totalQuestions, 50)) })}
                  className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Available: {totalQuestions} questions
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setConfig({ ...config, difficulty: difficulty as any })}
                  className={`py-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                    config.difficulty === difficulty
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-text)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
              Options
            </label>
            <label className="flex items-center gap-3 p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface)] transition-colors">
              <input
                type="checkbox"
                checked={config.shuffle}
                onChange={(e) => setConfig({ ...config, shuffle: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <div>
                <div className="text-sm font-medium text-[var(--color-text)]">Shuffle Questions</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Randomize question order
                </div>
              </div>
            </label>
          </div>

          {/* Mode-specific info */}
          {config.mode === 'timed' && (
            <div className="p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)] rounded-lg">
              <div className="text-sm font-medium text-[var(--color-text)] mb-1">
                Timed Mode
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                You'll have {Math.round(config.questionCount * 1.5)} minutes to complete this quiz (90 seconds per question).
              </div>
            </div>
          )}

          {config.mode === 'review' && (
            <div className="p-4 bg-[var(--color-info)]/10 border border-[var(--color-info)] rounded-lg">
              <div className="text-sm font-medium text-[var(--color-text)] mb-1">
                Review Mode
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                Explanations will be visible as you answer. Perfect for learning new material.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--color-border)] sticky bottom-0 bg-[var(--color-surface)]">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-background)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}