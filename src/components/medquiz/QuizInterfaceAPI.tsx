/**
 * QuizInterface - API Integrated Version
 *
 * Fetches questions from the backend API and submits answers.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  Pause,
  Play,
  X,
  Clock,
  Check,
  AlertCircle,
  FileText,
  CreditCard,
  Sparkles,
  BookOpen,
  Loader2
} from 'lucide-react';
import { quizApi } from '../../api';
import type {
  QuizSessionResponse,
  QuizQuestionWithOptions,
  AnswerResult,
  QuizMode,
} from '../../api/types';
import { toast } from 'sonner';

interface QuizInterfaceProps {
  categoryId: number;
  specialtyId: number;
  mode: QuizMode;
  questionCount?: number;
  timeLimitMinutes?: number;
  onComplete: (results: QuizResultsData) => void;
  onExit: () => void;
}

export interface QuizResultsData {
  attemptId: number;
  questions: QuizQuestionWithOptions[];
  answers: Map<number, AnswerResult>;
  flagged: Set<number>;
  timeSpent: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
}

export function QuizInterfaceAPI({
  categoryId,
  specialtyId,
  mode,
  questionCount = 20,
  timeLimitMinutes,
  onComplete,
  onExit
}: QuizInterfaceProps) {
  const [session, setSession] = useState<QuizSessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerResult>>(new Map());
  const [selectedOptions, setSelectedOptions] = useState<Map<number, number>>(new Map());
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Start quiz session on mount
  useEffect(() => {
    const startQuiz = async () => {
      try {
        setLoading(true);
        const response = await quizApi.startSession({
          category_ids: [categoryId],
          specialty_id: specialtyId,
          mode,
          question_count: questionCount,
          time_limit_minutes: timeLimitMinutes,
          shuffle_questions: true,
          shuffle_options: true,
        });
        setSession(response);
      } catch (err) {
        setError('Failed to start quiz session');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    startQuiz();
  }, [categoryId, specialtyId, mode, questionCount, timeLimitMinutes]);

  // Timer
  useEffect(() => {
    if (isPaused || !session) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, session]);

  // Auto-show explanation in review mode
  useEffect(() => {
    if (mode === 'review' && currentQuestion && answers.has(currentQuestion.id)) {
      setShowExplanation(true);
    }
  }, [currentQuestionIndex, mode]);

  const currentQuestion = session?.questions[currentQuestionIndex] ?? null;
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null;
  const isAnswered = currentAnswer !== null;
  const isCorrect = currentAnswer?.is_correct ?? false;

  const handleAnswerSelect = useCallback(async (optionId: number) => {
    if (!session || !currentQuestion || submittingAnswer) return;

    // Store selected option immediately for UI
    setSelectedOptions(prev => new Map(prev).set(currentQuestion.id, optionId));
    setSubmittingAnswer(true);

    try {
      const result = await quizApi.submitAnswer(session.attempt_id, {
        question_id: currentQuestion.id,
        selected_option_id: optionId,
        time_spent_seconds: timeElapsed,
      });

      setAnswers(prev => new Map(prev).set(currentQuestion.id, result));

      // In standard mode, show explanation after answering
      if (mode === 'standard' || mode === 'incorrect') {
        setShowExplanation(true);
      }
    } catch (err) {
      toast.error('Failed to submit answer');
      console.error(err);
      // Revert selection on error
      setSelectedOptions(prev => {
        const next = new Map(prev);
        next.delete(currentQuestion.id);
        return next;
      });
    } finally {
      setSubmittingAnswer(false);
    }
  }, [session, currentQuestion, submittingAnswer, timeElapsed, mode]);

  const handleNext = useCallback(() => {
    if (!session) return;

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(mode === 'review');
    } else {
      handleSubmit();
    }
  }, [session, currentQuestionIndex, mode]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestion = session?.questions[currentQuestionIndex - 1];
      setShowExplanation(mode === 'review' || (prevQuestion && answers.has(prevQuestion.id)));
    }
  }, [currentQuestionIndex, session, mode, answers]);

  const handleFlag = useCallback(async () => {
    if (!session || !currentQuestion) return;

    const newFlagged = new Set(flagged);
    const isFlagged = newFlagged.has(currentQuestion.id);

    if (isFlagged) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    setFlagged(newFlagged);

    // Also update on server
    try {
      await quizApi.flagQuestion(session.attempt_id, currentQuestion.id, !isFlagged);
    } catch (err) {
      console.error('Failed to flag question:', err);
    }
  }, [session, currentQuestion, flagged]);

  const handleSubmit = useCallback(async () => {
    if (!session) return;

    try {
      const attempt = await quizApi.completeSession(session.attempt_id);

      const results: QuizResultsData = {
        attemptId: session.attempt_id,
        questions: session.questions,
        answers,
        flagged,
        timeSpent: timeElapsed,
        score: attempt.score_percentage,
        totalQuestions: attempt.total_questions,
        correctAnswers: attempt.correct_answers,
        wrongAnswers: attempt.wrong_answers,
        skippedAnswers: attempt.skipped_answers,
      };

      onComplete(results);
    } catch (err) {
      toast.error('Failed to complete quiz');
      console.error(err);
    }
  }, [session, answers, flagged, timeElapsed, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.size;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !session || session.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[var(--color-danger)] mx-auto mb-4" />
          <h2 className="text-[var(--color-text)] mb-2">{error || 'No Questions Available'}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            {error || 'Questions for this topic are coming soon.'}
          </p>
          <button
            onClick={onExit}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowExitConfirm(true)}
                className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
              <div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                </div>
                <h2 className="text-[var(--color-text)]">Quiz Session</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <span className="text-[var(--color-text)]">{formatTime(timeElapsed)}</span>
              </div>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              >
                {isPaused ? (
                  <Play className="w-5 h-5 text-[var(--color-text-secondary)]" />
                ) : (
                  <Pause className="w-5 h-5 text-[var(--color-text-secondary)]" />
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {currentQuestionIndex + 1} / {session.questions.length}
            </span>
            <div className="flex-1 h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {answeredCount} answered
            </span>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 max-w-md">
            <h3 className="text-[var(--color-text)] mb-4">Quiz Paused</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Take your time. Click resume when you're ready to continue.
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Resume Quiz
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 max-w-md">
            <h3 className="text-[var(--color-text)] mb-4">Exit Quiz?</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Your progress will be saved. Are you sure you want to leave?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-background)] transition-colors"
              >
                Continue Quiz
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 bg-[var(--color-danger)] text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            {currentQuestion && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs text-[var(--color-text-secondary)]">
                        {currentQuestion.difficulty}
                      </span>
                      {flagged.has(currentQuestion.id) && (
                        <span className="px-2 py-1 bg-[var(--color-warning)]/10 border border-[var(--color-warning)] rounded text-xs text-[var(--color-warning)]">
                          Flagged
                        </span>
                      )}
                    </div>
                    <div
                      className="text-[var(--color-text)] leading-relaxed quiz-html-content"
                      dangerouslySetInnerHTML={{ __html: currentQuestion.title }}
                    />
                    {currentQuestion.additional_text && (
                      <div
                        className="text-sm text-[var(--color-text-secondary)] mt-2 quiz-html-content"
                        dangerouslySetInnerHTML={{ __html: currentQuestion.additional_text }}
                      />
                    )}
                  </div>
                  <button
                    onClick={handleFlag}
                    className="ml-4 p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                  >
                    <Flag
                      className={`w-5 h-5 ${
                        flagged.has(currentQuestion.id)
                          ? 'fill-[var(--color-warning)] text-[var(--color-warning)]'
                          : 'text-[var(--color-text-secondary)]'
                      }`}
                    />
                  </button>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptions.get(currentQuestion.id) === option.id;
                    const answerResult = answers.get(currentQuestion.id);
                    const showCorrectness = showExplanation && answerResult;
                    const isCorrectOption = answerResult?.correct_option_id === option.id;
                    const optionAnswer = answerResult?.options.find(o => o.id === option.id);

                    return (
                      <div key={option.id}>
                        <button
                          onClick={() => !showExplanation && handleAnswerSelect(option.id)}
                          disabled={showExplanation || submittingAnswer}
                          className={`
                            w-full text-left p-4 rounded-lg border-2 transition-all
                            ${!showExplanation && !submittingAnswer && 'hover:border-[var(--color-primary)] cursor-pointer'}
                            ${showExplanation && 'cursor-default'}
                            ${isSelected && !showCorrectness ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)]'}
                            ${showCorrectness && isCorrectOption ? 'border-[var(--color-success)] bg-[var(--color-success)]/5' : ''}
                            ${showCorrectness && !isCorrectOption && isSelected ? 'border-[var(--color-danger)] bg-[var(--color-danger)]/5' : ''}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`
                                w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                                ${isSelected && !showCorrectness ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-border)]'}
                                ${showCorrectness && isCorrectOption ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white' : ''}
                                ${showCorrectness && !isCorrectOption && isSelected ? 'border-[var(--color-danger)] bg-[var(--color-danger)] text-white' : ''}
                              `}
                            >
                              {showCorrectness && isCorrectOption && <Check className="w-4 h-4" />}
                              {showCorrectness && !isCorrectOption && isSelected && <X className="w-4 h-4" />}
                              {!showCorrectness && isSelected && <span className="text-xs">✓</span>}
                            </div>
                            <div className="flex-1">
                              <span className={`${
                                showCorrectness && isCorrectOption ? 'text-[var(--color-success)] font-medium' :
                                showCorrectness && !isCorrectOption && isSelected ? 'text-[var(--color-danger)] font-medium' :
                                'text-[var(--color-text)]'
                              }`}>
                                {option.title}
                              </span>
                              {showExplanation && option.content && (
                                <div
                                  className="text-sm text-[var(--color-text-secondary)] mt-2 quiz-html-content"
                                  dangerouslySetInnerHTML={{ __html: option.content }}
                                />
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && currentAnswer && (
              <div
                className={`
                  border-2 rounded-lg p-6 max-h-[600px] overflow-y-auto
                  ${isCorrect
                    ? 'border-[var(--color-success)] bg-[var(--color-success)]/5'
                    : 'border-[var(--color-danger)] bg-[var(--color-danger)]/5'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-4">
                  {isCorrect ? (
                    <>
                      <Check className="w-5 h-5 text-[var(--color-success)]" />
                      <span className="font-medium text-[var(--color-success)]">Correct!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-[var(--color-danger)]" />
                      <span className="font-medium text-[var(--color-danger)]">Incorrect</span>
                    </>
                  )}
                </div>

                {currentAnswer.explanation && (
                  <>
                    <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">Explanation</h4>
                    <div
                      className="text-sm text-[var(--color-text)] leading-relaxed mb-4 quiz-html-content"
                      dangerouslySetInnerHTML={{ __html: currentAnswer.explanation }}
                    />
                  </>
                )}

                {/* Save Actions */}
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toast.success('Saved to MedCards')}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Save to MedCards
                    </button>
                    <button
                      onClick={() => toast.success('Saved to MedNotes')}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Save to MedNotes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] font-medium hover:bg-[var(--color-background)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestionIndex === session.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className="px-6 py-2 bg-[var(--color-success)] text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Question Navigator */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 sticky top-6">
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {session.questions.map((question, index) => {
                  const isCurrentQuestion = index === currentQuestionIndex;
                  const isQuestionAnswered = answers.has(question.id);
                  const isQuestionFlagged = flagged.has(question.id);

                  return (
                    <button
                      key={question.id}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setShowExplanation(mode === 'review' || answers.has(question.id));
                      }}
                      className={`
                        relative w-10 h-10 rounded-lg text-sm font-medium transition-all
                        ${isCurrentQuestion
                          ? 'bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-surface)]'
                          : isQuestionAnswered
                          ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]'
                          : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
                        }
                      `}
                    >
                      {index + 1}
                      {isQuestionFlagged && (
                        <Flag className="absolute -top-1 -right-1 w-3 h-3 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Answered</span>
                  <span className="text-[var(--color-text)]">{answeredCount}/{session.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Flagged</span>
                  <span className="text-[var(--color-text)]">{flagged.size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
