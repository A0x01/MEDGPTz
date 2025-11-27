import React, { useState, useEffect, useMemo } from 'react';
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
  BookmarkPlus,
  FileText,
  CreditCard,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Question, QuizMode } from '../../types/medquiz';
import { generateMockQuestions } from '../../data/medquiz-questions';
import { findTopicById, getBreadcrumbTrail } from '../../data/medquiz-topics';
import { toast } from 'sonner@2.0.3';

interface QuizInterfaceProps {
  topicId: string;
  mode: QuizMode;
  onComplete: (results: QuizResults) => void;
  onExit: () => void;
}

export interface QuizResults {
  questions: Question[];
  answers: (number | null)[];
  flagged: boolean[];
  timeSpent: number;
  score: number;
}

export function QuizInterface({ topicId, mode, onComplete, onExit }: QuizInterfaceProps) {
  const topic = findTopicById(topicId);
  const breadcrumbs = getBreadcrumbTrail(topicId);
  
  const questions = useMemo(() => {
    // Generate questions based on mode and topic
    const count = mode === 'timed' ? 20 : Math.min(topic?.questionCount || 10, 30);
    return generateMockQuestions(topicId, count);
  }, [topicId, mode, topic]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showExplanation, setShowExplanation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [selectedTextbook, setSelectedTextbook] = useState('step-up');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isAnswered = currentAnswer !== null;
  const isCorrect = isAnswered && currentAnswer === currentQuestion.correctAnswer;

  const textbooks = [
    { id: 'step-up', name: 'Step Up to Medicine' },
    { id: 'first-aid', name: 'First Aid Step 2 CK' },
    { id: 'harrisons', name: "Harrison's Internal Medicine" },
    { id: 'robbins', name: 'Robbins Basic Pathology' },
    { id: 'master-boards', name: 'Master the Boards Step 2' },
    { id: 'toronto', name: 'Toronto Notes' },
  ];

  // Timer
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-show explanation in review mode
  useEffect(() => {
    if (mode === 'review' && isAnswered) {
      setShowExplanation(true);
    }
  }, [currentQuestionIndex, mode, isAnswered]);

  // Reset AI explanation when changing questions
  useEffect(() => {
    setShowAIExplanation(false);
    setAiExplanation('');
  }, [currentQuestionIndex]);

  const handleGenerateAIExplanation = () => {
    setIsGeneratingAI(true);
    setShowAIExplanation(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const textbookName = textbooks.find(t => t.id === selectedTextbook)?.name || 'medical textbook';
      const explanation = `Based on ${textbookName}, this question tests your understanding of ${currentQuestion.category || 'clinical reasoning'}. ${
        isCorrect 
          ? 'Your reasoning is correct! ' 
          : 'The correct answer requires understanding the following: '
      }

${currentQuestion.explanation}

Key concepts from ${textbookName}:
• This topic is frequently tested on USMLE Step 2 CK
• Understanding the pathophysiology is crucial for clinical application
• Consider differential diagnoses and treatment algorithms

Additional context: This question relates to real-world clinical scenarios you'll encounter during your clerkships and residency.`;
      
      setAiExplanation(explanation);
      setIsGeneratingAI(false);
    }, 2000);
  };

  const handleSaveToNotes = () => {
    toast.success('Saved to MedNotes', {
      description: 'Question and explanation added to your notes'
    });
  };

  const handleSaveToCards = () => {
    toast.success('Saved to MedCards', {
      description: 'Flashcard created from this question'
    });
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    
    // In standard mode, show explanation after answering
    if (mode === 'standard' || mode === 'incorrect') {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(mode === 'review');
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(mode === 'review' || isAnswered);
    }
  };

  const handleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestionIndex] = !newFlagged[currentQuestionIndex];
    setFlagged(newFlagged);
  };

  const handleSubmit = () => {
    const correctCount = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    
    const results: QuizResults = {
      questions,
      answers,
      flagged,
      timeSpent: timeElapsed,
      score: Math.round((correctCount / questions.length) * 100)
    };
    
    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  if (!topic || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[var(--color-danger)] mx-auto mb-4" />
          <h2 className="text-[var(--color-text)] mb-2">No Questions Available</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Questions for this topic are coming soon.
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
                  {breadcrumbs.map(b => b.name).join(' › ')}
                </div>
                <h2 className="text-[var(--color-text)]">{topic.name}</h2>
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
              {currentQuestionIndex + 1} / {questions.length}
            </span>
            <div className="flex-1 h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
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
              Your progress will be lost if you exit now. Are you sure you want to leave?
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
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-xs text-[var(--color-text-secondary)]">
                      {currentQuestion.difficulty}
                    </span>
                    {flagged[currentQuestionIndex] && (
                      <span className="px-2 py-1 bg-[var(--color-warning)]/10 border border-[var(--color-warning)] rounded text-xs text-[var(--color-warning)]">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--color-text)] leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>
                <button
                  onClick={handleFlag}
                  className="ml-4 p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                >
                  <Flag
                    className={`w-5 h-5 ${
                      flagged[currentQuestionIndex]
                        ? 'fill-[var(--color-warning)] text-[var(--color-warning)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                  />
                </button>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = currentAnswer === index;
                  const isCorrectOption = index === currentQuestion.correctAnswer;
                  const isIncorrectOption = !isCorrectOption;
                  const showCorrectness = showExplanation && isAnswered;
                  const optionExplanation = currentQuestion.optionExplanations?.[index];

                  return (
                    <div key={index}>
                      <button
                        onClick={() => !showExplanation && handleAnswerSelect(index)}
                        disabled={showExplanation}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-all
                          ${!showExplanation && 'hover:border-[var(--color-primary)] cursor-pointer'}
                          ${showExplanation && 'cursor-default'}
                          ${isSelected && !showCorrectness ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)]'}
                          ${showCorrectness && isCorrectOption ? 'border-[var(--color-success)] bg-[var(--color-success)]/5' : ''}
                          ${showCorrectness && isIncorrectOption ? 'border-[var(--color-danger)] bg-[var(--color-danger)]/5' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`
                              w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                              ${isSelected && !showCorrectness ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-border)]'}
                              ${showCorrectness && isCorrectOption ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white' : ''}
                              ${showCorrectness && isIncorrectOption ? 'border-[var(--color-danger)] bg-[var(--color-danger)] text-white' : ''}
                            `}
                          >
                            {showCorrectness && isCorrectOption && <Check className="w-4 h-4" />}
                            {showCorrectness && isIncorrectOption && <X className="w-4 h-4" />}
                            {!showCorrectness && isSelected && <span className="text-xs">✓</span>}
                          </div>
                          <span className={`flex-1 ${
                            showCorrectness && isCorrectOption ? 'text-[var(--color-success)] font-medium' : 
                            showCorrectness && isIncorrectOption ? 'text-[var(--color-danger)] font-medium' : 
                            'text-[var(--color-text)]'
                          }`}>{option}</span>
                        </div>
                      </button>
                      
                      {/* Show explanation directly under each option after answering */}
                      {showCorrectness && optionExplanation && (
                        <div className={`mt-2 ml-9 p-3 rounded-lg text-xs leading-relaxed ${
                          isCorrectOption 
                            ? 'text-[var(--color-text)]' 
                            : 'text-[var(--color-text)]'
                        }`}>
                          {optionExplanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && isAnswered && (
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
                
                <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">Explanation</h4>
                <div className="text-sm text-[var(--color-text)] leading-relaxed mb-4">
                  {currentQuestion.explanation}
                </div>

                {/* AI Explanation Section */}
                {showAIExplanation && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <h4 className="text-sm font-medium text-[var(--color-text)] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                      AI Enhanced Explanation
                    </h4>
                    {isGeneratingAI ? (
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] py-4">
                        <Sparkles className="w-4 h-4 animate-pulse text-[var(--color-primary)]" />
                        <span>Generating detailed explanation from {textbooks.find(t => t.id === selectedTextbook)?.name}...</span>
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-line">
                        {aiExplanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3">
                  {/* Textbook Selector & AI Button */}
                  {!showAIExplanation && (
                    <div className="space-y-2">
                      <label className="text-xs text-[var(--color-text-secondary)]">
                        Choose textbook for AI explanation:
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                          <select
                            value={selectedTextbook}
                            onChange={(e) => setSelectedTextbook(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm text-[var(--color-text)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] appearance-none"
                          >
                            {textbooks.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={handleGenerateAIExplanation}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                          <Sparkles className="w-4 h-4" />
                          Get AI Explanation
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Save Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleSaveToCards}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Save to MedCards
                    </button>
                    <button
                      onClick={handleSaveToNotes}
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

              {currentQuestionIndex === questions.length - 1 ? (
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
                {questions.map((_, index) => {
                  const isCurrentQuestion = index === currentQuestionIndex;
                  const isQuestionAnswered = answers[index] !== null;
                  const isQuestionFlagged = flagged[index];

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setShowExplanation(mode === 'review' || answers[index] !== null);
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
                  <span className="text-[var(--color-text)]">{answeredCount}/{questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Flagged</span>
                  <span className="text-[var(--color-text)]">{flagged.filter(f => f).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}