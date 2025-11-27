/**
 * MedQuiz - API Integrated Version
 *
 * Main quiz component that uses the backend API.
 */

import { useState } from 'react';
import { MedQuizHomeAPI } from './medquiz/MedQuizHomeAPI';
import { TopicExplorerAPI } from './medquiz/TopicExplorerAPI';
import { QuizInterfaceAPI, QuizResultsData } from './medquiz/QuizInterfaceAPI';
import { QuizResultsAPI } from './medquiz/QuizResultsAPI';
import { QuizSettingsAPI } from './medquiz/QuizSettingsAPI';
import type { QuizMode } from '../api/types';

type Screen =
  | { type: 'home' }
  | { type: 'explorer' }
  | { type: 'quiz-settings'; categoryId: number; specialtyId: number }
  | { type: 'quiz'; categoryId: number; specialtyId: number; mode: QuizMode; questionCount?: number; timeLimitMinutes?: number }
  | { type: 'results'; results: QuizResultsData };

export function MedQuizAPI() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' });

  const handleNavigateToExplorer = () => {
    setScreen({ type: 'explorer' });
  };

  const handleStartQuickQuiz = (categoryId: number, specialtyId: number) => {
    setScreen({
      type: 'quiz',
      categoryId,
      specialtyId,
      mode: 'standard',
      questionCount: 10
    });
  };

  const handleSelectTopic = (categoryId: number, specialtyId: number) => {
    setScreen({ type: 'quiz-settings', categoryId, specialtyId });
  };

  const handleStartCustomQuiz = (
    categoryId: number,
    specialtyId: number,
    mode: QuizMode,
    questionCount: number,
    timeLimitMinutes?: number
  ) => {
    setScreen({
      type: 'quiz',
      categoryId,
      specialtyId,
      mode,
      questionCount,
      timeLimitMinutes
    });
  };

  const handleQuizComplete = (results: QuizResultsData) => {
    setScreen({ type: 'results', results });
  };

  const handleRetryQuiz = (categoryId: number, specialtyId: number, mode: QuizMode = 'standard') => {
    setScreen({
      type: 'quiz',
      categoryId,
      specialtyId,
      mode,
      questionCount: 20
    });
  };

  const handleBackToHome = () => {
    setScreen({ type: 'home' });
  };

  const handleBackToExplorer = () => {
    setScreen({ type: 'explorer' });
  };

  return (
    <div className="h-full overflow-y-auto">
      {screen.type === 'home' && (
        <MedQuizHomeAPI
          onNavigateToExplorer={handleNavigateToExplorer}
          onStartQuickQuiz={handleStartQuickQuiz}
        />
      )}

      {screen.type === 'explorer' && (
        <TopicExplorerAPI
          onSelectTopic={handleSelectTopic}
          onBack={handleBackToHome}
        />
      )}

      {screen.type === 'quiz-settings' && (
        <QuizSettingsAPI
          categoryId={screen.categoryId}
          specialtyId={screen.specialtyId}
          onStart={(mode, questionCount, timeLimitMinutes) =>
            handleStartCustomQuiz(screen.categoryId, screen.specialtyId, mode, questionCount, timeLimitMinutes)
          }
          onClose={handleBackToExplorer}
        />
      )}

      {screen.type === 'quiz' && (
        <QuizInterfaceAPI
          categoryId={screen.categoryId}
          specialtyId={screen.specialtyId}
          mode={screen.mode}
          questionCount={screen.questionCount}
          timeLimitMinutes={screen.timeLimitMinutes}
          onComplete={handleQuizComplete}
          onExit={handleBackToExplorer}
        />
      )}

      {screen.type === 'results' && (
        <QuizResultsAPI
          results={screen.results}
          onRetry={(categoryId, specialtyId) => handleRetryQuiz(categoryId, specialtyId)}
          onRetryIncorrect={(categoryId, specialtyId) => handleRetryQuiz(categoryId, specialtyId, 'incorrect')}
          onHome={handleBackToHome}
        />
      )}
    </div>
  );
}
