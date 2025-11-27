import React, { useState, useMemo } from 'react';
import { Play, Trophy, Target, TrendingUp, Clock, Star, BookOpen, Zap } from 'lucide-react';
import { medicalTopics } from '../../data/medquiz-topics';
import { UserStats } from '../../types/medquiz';

interface MedQuizHomeProps {
  onNavigateToExplorer: () => void;
  onStartQuickQuiz: (topicId: string) => void;
}

export function MedQuizHome({ onNavigateToExplorer, onStartQuickQuiz }: MedQuizHomeProps) {
  // Mock user stats - would come from backend in production
  const userStats: UserStats = {
    totalQuizzes: 47,
    totalQuestions: 1250,
    overallAccuracy: 78,
    currentStreak: 5,
    longestStreak: 12,
    favoriteTopics: ['cardiology', 'neurology', 'emergency-medicine'],
    recentTopics: ['heart-failure', 'ischemic-stroke', 'pneumonia'],
    xp: 12450,
    level: 8
  };

  const recentTopics = useMemo(() => {
    return [
      { id: 'heart-failure', name: 'Heart Failure', specialty: 'Cardiology', lastScore: 82, questionsAttempted: 45 },
      { id: 'ischemic-stroke', name: 'Ischemic Stroke', specialty: 'Neurology', lastScore: 75, questionsAttempted: 38 },
      { id: 'pneumonia', name: 'Pneumonia', specialty: 'Pulmonology', lastScore: 88, questionsAttempted: 42 }
    ];
  }, []);

  const dailyChallenge = {
    topic: 'Acute Abdomen',
    questions: 10,
    difficulty: 'Mixed',
    xpReward: 150
  };

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
                <div className="text-sm text-[var(--color-text-secondary)]">Level {userStats.level}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-32 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--color-primary)]"
                      style={{ width: `${(userStats.xp % 1000) / 10}%` }}
                    />
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">{userStats.xp % 1000}/1000 XP</span>
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
                <div className="text-2xl text-[var(--color-text)]">{userStats.totalQuizzes}</div>
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
                <div className="text-2xl text-[var(--color-text)]">{userStats.overallAccuracy}%</div>
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
                <div className="text-2xl text-[var(--color-text)]">{userStats.currentStreak}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-info)]/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--color-info)]" />
              </div>
              <div>
                <div className="text-2xl text-[var(--color-text)]">{userStats.totalQuestions}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Questions Attempted</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5" />
                    <span className="text-sm font-medium">Daily Challenge</span>
                  </div>
                  <h3 className="text-white mb-1">{dailyChallenge.topic}</h3>
                  <p className="text-blue-100 text-sm">
                    {dailyChallenge.questions} questions • {dailyChallenge.difficulty} difficulty
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Earn</div>
                  <div className="text-2xl">+{dailyChallenge.xpReward} XP</div>
                </div>
              </div>
              <button
                onClick={() => onStartQuickQuiz('acute-abdomen')}
                className="w-full bg-white text-[var(--color-primary)] py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Start Daily Challenge
              </button>
            </div>

            {/* Browse All Topics */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[var(--color-text)] mb-1">Browse All Topics</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Explore {medicalTopics.length} specialties with thousands of questions
                  </p>
                </div>
              </div>
              <button
                onClick={onNavigateToExplorer}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Explore Topics
              </button>
            </div>

            {/* Continue Where You Left Off */}
            {recentTopics.length > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                <h3 className="text-[var(--color-text)] mb-4">Continue Learning</h3>
                <div className="space-y-3">
                  {recentTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                      onClick={() => onStartQuickQuiz(topic.id)}
                    >
                      <div className="flex-1">
                        <div className="text-[var(--color-text)] font-medium">{topic.name}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">{topic.specialty}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-[var(--color-text-secondary)]">Last Score</div>
                          <div className="text-[var(--color-text)] font-medium">{topic.lastScore}%</div>
                        </div>
                        <Play className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="text-[var(--color-text)] mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-secondary)]">Questions Mastered</span>
                    <span className="text-[var(--color-text)]">67%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-success)]" style={{ width: '67%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-secondary)]">Topics Completed</span>
                    <span className="text-[var(--color-text)]">45%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)]" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Study Modes */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="text-[var(--color-text)] mb-4">Study Modes</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--color-text)]">Standard Mode</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">Self-paced learning</div>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--color-warning)]/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[var(--color-warning)]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--color-text)]">Timed Mode</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">Simulate exam conditions</div>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--color-danger)]/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-[var(--color-danger)]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--color-text)]">Incorrect Only</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">Review weak areas</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
              <h3 className="text-[var(--color-text)] mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[var(--color-warning)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text)]">5-Day Streak</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Keep it up!</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text)]">Cardiology Master</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">100% in Heart Failure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
