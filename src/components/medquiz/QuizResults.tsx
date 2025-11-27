import React, { useState } from 'react';
import {
  Trophy,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  RotateCcw,
  Home,
  Flag,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Share2
} from 'lucide-react';
import { QuizResults as QuizResultsType } from './QuizInterface';
import { findTopicById } from '../../data/medquiz-topics';

interface QuizResultsProps {
  results: QuizResultsType;
  topicId: string;
  onRetry: () => void;
  onRetryIncorrect: () => void;
  onHome: () => void;
}

export function QuizResults({ results, topicId, onRetry, onRetryIncorrect, onHome }: QuizResultsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);

  const topic = findTopicById(topicId);
  const { questions, answers, flagged, timeSpent, score } = results;

  const correctCount = answers.filter((answer, index) =>
    answer === questions[index].correctAnswer
  ).length;
  const incorrectCount = questions.length - correctCount;
  const flaggedCount = flagged.filter(f => f).length;

  const avgTimePerQuestion = Math.round(timeSpent / questions.length);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[var(--color-success)]';
    if (score >= 60) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-danger)]';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! 🎉';
    if (score >= 80) return 'Great job! 👏';
    if (score >= 70) return 'Good work! 👍';
    if (score >= 60) return 'Keep practicing! 📚';
    return 'Review and try again! 💪';
  };

  const difficultyBreakdown = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 }
  };

  questions.forEach((q, index) => {
    difficultyBreakdown[q.difficulty].total++;
    if (answers[index] === q.correctAnswer) {
      difficultyBreakdown[q.difficulty].correct++;
    }
  });

  const questionsToDisplay = showOnlyIncorrect
    ? questions.map((q, i) => ({ question: q, index: i })).filter(({ index }) => answers[index] !== questions[index].correctAnswer)
    : questions.map((q, i) => ({ question: q, index: i }));

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-[var(--color-text)] mb-2">Quiz Complete!</h1>
          <p className="text-[var(--color-text-secondary)]">{topic?.name}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between text-white">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8" />
                <span className="text-xl font-medium">{getScoreMessage(score)}</span>
              </div>
              <div className="text-6xl font-bold mb-2">{score}%</div>
              <p className="text-blue-100 text-lg">
                {correctCount} out of {questions.length} correct
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Time</div>
              <div className="text-3xl font-medium">{formatTime(timeSpent)}</div>
              <div className="text-sm opacity-90 mt-2">{avgTimePerQuestion}s per question</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-[var(--color-text)] mb-6">Performance Overview</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-8 h-8 text-[var(--color-success)]" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-text)]">{correctCount}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Correct</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center mx-auto mb-2">
                    <XCircle className="w-8 h-8 text-[var(--color-danger)]" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-text)]">{incorrectCount}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Incorrect</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center mx-auto mb-2">
                    <Flag className="w-8 h-8 text-[var(--color-warning)]" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-text)]">{flaggedCount}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Flagged</div>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text)] mb-4">Performance by Difficulty</h3>
                <div className="space-y-3">
                  {Object.entries(difficultyBreakdown).map(([difficulty, stats]) => {
                    if (stats.total === 0) return null;
                    const percentage = Math.round((stats.correct / stats.total) * 100);
                    
                    return (
                      <div key={difficulty}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-[var(--color-text)] capitalize">{difficulty}</span>
                          <span className="text-[var(--color-text-secondary)]">
                            {stats.correct}/{stats.total} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              percentage >= 80
                                ? 'bg-[var(--color-success)]'
                                : percentage >= 60
                                ? 'bg-[var(--color-warning)]'
                                : 'bg-[var(--color-danger)]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[var(--color-text)]">Question Review</h2>
                <button
                  onClick={() => setShowOnlyIncorrect(!showOnlyIncorrect)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showOnlyIncorrect
                      ? 'bg-[var(--color-danger)] text-white'
                      : 'bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)]'
                  }`}
                >
                  {showOnlyIncorrect ? 'Show All' : 'Show Incorrect Only'}
                </button>
              </div>

              <div className="space-y-3">
                {questionsToDisplay.map(({ question, index }) => {
                  const isExpanded = expandedQuestions.has(index);
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  const isFlagged = flagged[index];

                  return (
                    <div
                      key={index}
                      className={`border-2 rounded-lg overflow-hidden transition-colors ${
                        isCorrect
                          ? 'border-[var(--color-success)]/30'
                          : 'border-[var(--color-danger)]/30'
                      }`}
                    >
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full p-4 text-left hover:bg-[var(--color-background)] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
                            {isCorrect ? (
                              <CheckCircle className="w-6 h-6 text-[var(--color-success)]" />
                            ) : (
                              <XCircle className="w-6 h-6 text-[var(--color-danger)]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                                Question {index + 1}
                              </span>
                              <span className="px-2 py-0.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs text-[var(--color-text-secondary)]">
                                {question.difficulty}
                              </span>
                              {isFlagged && (
                                <Flag className="w-3 h-3 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                              )}
                            </div>
                            <p className="text-sm text-[var(--color-text)] line-clamp-2">
                              {question.question}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-[var(--color-border)]">
                          <div className="pt-4 space-y-3">
                            {question.options.map((option, optionIndex) => {
                              const isCorrectOption = optionIndex === question.correctAnswer;
                              const isUserAnswer = optionIndex === userAnswer;

                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    isCorrectOption
                                      ? 'border-[var(--color-success)] bg-[var(--color-success)]/5'
                                      : isUserAnswer
                                      ? 'border-[var(--color-danger)] bg-[var(--color-danger)]/5'
                                      : 'border-[var(--color-border)]'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {isCorrectOption && (
                                      <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
                                    )}
                                    {isUserAnswer && !isCorrectOption && (
                                      <XCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0" />
                                    )}
                                    <span className="text-sm text-[var(--color-text)]">{option}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-4 p-4 bg-[var(--color-background)] rounded-lg">
                            <div className="text-sm font-medium text-[var(--color-text)] mb-2">
                              Explanation
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => {/* Integration with MedCards */}}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-colors"
                            >
                              <BookmarkPlus className="w-4 h-4" />
                              Save to MedCards
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Primary Actions */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="text-[var(--color-text)] mb-4">What's Next?</h3>
              <div className="space-y-3">
                <button
                  onClick={onRetry}
                  className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry Quiz
                </button>

                {incorrectCount > 0 && (
                  <button
                    onClick={onRetryIncorrect}
                    className="w-full py-3 bg-[var(--color-danger)] text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Review Incorrect ({incorrectCount})
                  </button>
                )}

                <button
                  onClick={onHome}
                  className="w-full py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-background)] transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </button>
              </div>
            </div>

            {/* Share Results */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="text-[var(--color-text)] mb-4">Share</h3>
              <button
                onClick={() => {
                  const text = `I scored ${score}% on ${topic?.name} in MedGPT! 🎉`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text);
                  }
                }}
                className="w-full py-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-surface)] transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Results
              </button>
            </div>

            {/* Progress Insight */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="text-[var(--color-text)] mb-4">Insights</h3>
              <div className="space-y-4 text-sm">
                {score >= 80 ? (
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-[var(--color-success)] mt-0.5" />
                    <p className="text-[var(--color-text-secondary)]">
                      Excellent performance! Consider moving to more advanced topics.
                    </p>
                  </div>
                ) : incorrectCount > 5 ? (
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-[var(--color-warning)] mt-0.5" />
                    <p className="text-[var(--color-text-secondary)]">
                      Review the explanations for missed questions and try again.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 text-[var(--color-info)] mt-0.5" />
                    <p className="text-[var(--color-text-secondary)]">
                      You're making progress! Keep practicing to improve.
                    </p>
                  </div>
                )}

                {flaggedCount > 0 && (
                  <div className="flex items-start gap-2">
                    <Flag className="w-4 h-4 text-[var(--color-warning)] mt-0.5" />
                    <p className="text-[var(--color-text-secondary)]">
                      Review your {flaggedCount} flagged questions for deeper understanding.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
