import { useState } from 'react';
import { MedQuizHome } from './medquiz/MedQuizHome';
import { TopicExplorer } from './medquiz/TopicExplorer';
import { QuizInterface, QuizResults as QuizResultsType } from './medquiz/QuizInterface';
import { QuizResults } from './medquiz/QuizResults';
import { QuizSettings, QuizConfig } from './medquiz/QuizSettings';
import { QuizMode } from '../types/medquiz';
import { findTopicById } from '../data/medquiz-topics';

type Screen = 
  | { type: 'home' }
  | { type: 'explorer' }
  | { type: 'quiz-settings'; topicId: string }
  | { type: 'quiz'; topicId: string; mode: QuizMode; config?: QuizConfig }
  | { type: 'results'; topicId: string; results: QuizResultsType };

export function MedQuiz() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' });

  const handleNavigateToExplorer = () => {
    setScreen({ type: 'explorer' });
  };

  const handleStartQuickQuiz = (topicId: string) => {
    setScreen({ type: 'quiz', topicId, mode: 'standard' });
  };

  const handleSelectTopic = (topicId: string) => {
    setScreen({ type: 'quiz-settings', topicId });
  };

  const handleStartCustomQuiz = (topicId: string, config: QuizConfig) => {
    setScreen({ type: 'quiz', topicId, mode: config.mode, config });
  };

  const handleQuizComplete = (topicId: string, results: QuizResultsType) => {
    setScreen({ type: 'results', topicId, results });
  };

  const handleRetryQuiz = (topicId: string, mode: QuizMode = 'standard') => {
    setScreen({ type: 'quiz', topicId, mode });
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
        <MedQuizHome
          onNavigateToExplorer={handleNavigateToExplorer}
          onStartQuickQuiz={handleStartQuickQuiz}
        />
      )}

      {screen.type === 'explorer' && (
        <TopicExplorer
          onSelectTopic={handleSelectTopic}
          onBack={handleBackToHome}
        />
      )}

      {screen.type === 'quiz-settings' && (
        <QuizSettings
          topicName={findTopicById(screen.topicId)?.name || ''}
          totalQuestions={findTopicById(screen.topicId)?.questionCount || 0}
          onStart={(config) => handleStartCustomQuiz(screen.topicId, config)}
          onClose={handleBackToExplorer}
        />
      )}

      {screen.type === 'quiz' && (
        <QuizInterface
          topicId={screen.topicId}
          mode={screen.mode}
          onComplete={(results) => handleQuizComplete(screen.topicId, results)}
          onExit={handleBackToExplorer}
        />
      )}

      {screen.type === 'results' && (
        <QuizResults
          results={screen.results}
          topicId={screen.topicId}
          onRetry={() => handleRetryQuiz(screen.topicId)}
          onRetryIncorrect={() => handleRetryQuiz(screen.topicId, 'incorrect')}
          onHome={handleBackToHome}
        />
      )}
    </div>
  );
}