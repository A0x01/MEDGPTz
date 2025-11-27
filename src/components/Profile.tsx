import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Brain,
  Zap,
  Edit2,
  Camera
} from 'lucide-react';
import { Progress } from './ui/progress';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@medschool.edu',
    institution: 'Johns Hopkins School of Medicine',
    year: 'MS3',
    examDate: '2024-06-15',
    targetScore: '260',
  });

  const stats = {
    studyStreak: 12,
    totalQuestions: 1847,
    accuracy: 78,
    studyTime: 156, // hours
    flashcardsReviewed: 892,
    notesCreated: 23,
  };

  const recentActivity = [
    { id: 1, type: 'quiz', subject: 'Cardiology', score: 85, date: '2 hours ago' },
    { id: 2, type: 'flashcards', subject: 'Neurology', count: 23, date: '5 hours ago' },
    { id: 3, type: 'notes', subject: 'Respiratory', action: 'Created summary', date: '1 day ago' },
    { id: 4, type: 'quiz', subject: 'Surgery', score: 92, date: '1 day ago' },
    { id: 5, type: 'flashcards', subject: 'Pharmacology', count: 45, date: '2 days ago' },
  ];

  const achievements = [
    { id: 1, icon: '🔥', name: 'Week Warrior', description: '7 day study streak', unlocked: true },
    { id: 2, icon: '💯', name: 'Perfect Score', description: '100% on a quiz', unlocked: true },
    { id: 3, icon: '🎯', name: 'Sharpshooter', description: '1000 questions answered', unlocked: true },
    { id: 4, icon: '🧠', name: 'Memory Master', description: '500 flashcards mastered', unlocked: true },
    { id: 5, icon: '📚', name: 'Bookworm', description: '20 PDFs summarized', unlocked: true },
    { id: 6, icon: '⚡', name: 'Speed Demon', description: 'Complete quiz in under 30 min', unlocked: false },
  ];

  const subjectPerformance = [
    { subject: 'Cardiology', questions: 234, accuracy: 82, color: '#EF4444' },
    { subject: 'Neurology', questions: 189, accuracy: 76, color: '#8B5CF6' },
    { subject: 'Respiratory', questions: 167, accuracy: 85, color: '#3B82F6' },
    { subject: 'Surgery', questions: 298, accuracy: 71, color: '#EF4444' },
    { subject: 'Pharmacology', questions: 156, accuracy: 79, color: '#F59E0B' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-primary)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-[var(--text-primary)] mb-1">Profile</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Track your progress and manage your account
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--bg-primary)]">
                <User className="size-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="statistics" className="data-[state=active]:bg-[var(--bg-primary)]">
                <TrendingUp className="size-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-[var(--bg-primary)]">
                <Award className="size-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                    <div className="text-center mb-6">
                      <div className="relative inline-block mb-4">
                        <div className="size-24 rounded-full bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white text-3xl">
                          SC
                        </div>
                        <button className="absolute bottom-0 right-0 size-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white hover:bg-[#3B82F6]">
                          <Camera className="size-4" />
                        </button>
                      </div>
                      <h2 className="text-xl text-[var(--text-primary)] mb-1">{profile.name}</h2>
                      <p className="text-sm text-[var(--text-secondary)]">{profile.institution}</p>
                      <div className="inline-block px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-sm mt-2">
                        {profile.year}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="size-4 text-[var(--text-tertiary)]" />
                        <span className="text-[var(--text-secondary)]">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="size-4 text-[var(--text-tertiary)]" />
                        <span className="text-[var(--text-secondary)]">Exam: {new Date(profile.examDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Target className="size-4 text-[var(--text-tertiary)]" />
                        <span className="text-[var(--text-secondary)]">Target Score: {profile.targetScore}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)]"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 className="size-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Stats and Activity */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="size-5 text-[#F59E0B]" />
                        <p className="text-xs text-[var(--text-tertiary)]">Study Streak</p>
                      </div>
                      <p className="text-2xl text-[var(--text-primary)]">{stats.studyStreak} days</p>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="size-5 text-[#2563EB]" />
                        <p className="text-xs text-[var(--text-tertiary)]">Questions</p>
                      </div>
                      <p className="text-2xl text-[var(--text-primary)]">{stats.totalQuestions}</p>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="size-5 text-[#10B981]" />
                        <p className="text-xs text-[var(--text-tertiary)]">Accuracy</p>
                      </div>
                      <p className="text-2xl text-[var(--text-primary)]">{stats.accuracy}%</p>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="size-5 text-[#8B5CF6]" />
                        <p className="text-xs text-[var(--text-tertiary)]">Flashcards</p>
                      </div>
                      <p className="text-2xl text-[var(--text-primary)]">{stats.flashcardsReviewed}</p>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="size-5 text-[#06B6D4]" />
                        <p className="text-xs text-[var(--text-tertiary)]">Study Time</p>
                      </div>
                      <p className="text-2xl text-[var(--text-primary)]">{stats.studyTime}h</p>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="size-5 text-[#EC4899]" />
                        <p className="text-xs text-[var(--text-tertiary)]">Notes</p>
                      </div>
                      <p className="text-2xl text-[var(--text-primary)]">{stats.notesCreated}</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                    <h3 className="text-[var(--text-primary)] mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivity.map(activity => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {activity.type === 'quiz' && (
                              <div className="size-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                                <BookOpen className="size-5 text-[#2563EB]" />
                              </div>
                            )}
                            {activity.type === 'flashcards' && (
                              <div className="size-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                                <Brain className="size-5 text-[#8B5CF6]" />
                              </div>
                            )}
                            {activity.type === 'notes' && (
                              <div className="size-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                                <BookOpen className="size-5 text-[#10B981]" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-[var(--text-primary)]">
                                {activity.subject}
                              </p>
                              <p className="text-xs text-[var(--text-tertiary)]">
                                {activity.type === 'quiz' && `Score: ${activity.score}%`}
                                {activity.type === 'flashcards' && `${activity.count} cards reviewed`}
                                {activity.type === 'notes' && activity.action}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-[var(--text-tertiary)]">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics" className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                <h3 className="text-xl text-[var(--text-primary)] mb-6">Subject Performance</h3>
                <div className="space-y-6">
                  {subjectPerformance.map(subject => (
                    <div key={subject.subject}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="text-[var(--text-primary)]">{subject.subject}</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-[var(--text-secondary)]">
                            {subject.questions} questions
                          </span>
                          <span className="text-[var(--text-primary)]">
                            {subject.accuracy}%
                          </span>
                        </div>
                      </div>
                      <Progress value={subject.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                  <h3 className="text-[var(--text-primary)] mb-4">Study Time Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">MedChat</span>
                      <span className="text-[var(--text-primary)]">45h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">MedQuiz</span>
                      <span className="text-[var(--text-primary)]">62h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">MedCards</span>
                      <span className="text-[var(--text-primary)]">38h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">MedNotes</span>
                      <span className="text-[var(--text-primary)]">11h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
                  <h3 className="text-[var(--text-primary)] mb-4">Weekly Goal Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Questions</span>
                        <span className="text-sm text-[var(--text-primary)]">142/200</span>
                      </div>
                      <Progress value={71} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Flashcards</span>
                        <span className="text-sm text-[var(--text-primary)]">89/100</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Study Time</span>
                        <span className="text-sm text-[var(--text-primary)]">18/20h</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`bg-[var(--bg-secondary)] border-2 rounded-xl p-6 ${
                      achievement.unlocked
                        ? 'border-[#2563EB]'
                        : 'border-[var(--border-primary)] opacity-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-5xl mb-3 ${!achievement.unlocked && 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h3 className="text-[var(--text-primary)] mb-1">{achievement.name}</h3>
                      <p className="text-xs text-[var(--text-tertiary)]">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="mt-3 inline-block px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs">
                          Unlocked ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
