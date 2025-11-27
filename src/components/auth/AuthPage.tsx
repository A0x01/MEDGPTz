/**
 * Authentication Page
 *
 * Main container for login and registration forms.
 */

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { GraduationCap, BookOpen, Brain, Layers } from 'lucide-react';

type AuthMode = 'login' | 'register';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-primary to-blue-hover p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MedGPT</h1>
              <p className="text-white/70 text-sm">Student Platform</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Master Medicine<br />with AI-Powered Learning
          </h2>

          <p className="text-white/80 text-lg mb-12">
            Intelligent quizzes, organized notes, and spaced repetition flashcards
            to accelerate your medical education.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Brain className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Smart Quizzes</h3>
              <p className="text-white/70 text-sm">
                Over 5,000 questions across medical specialties with instant feedback
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Rich Notes</h3>
              <p className="text-white/70 text-sm">
                Create and organize notes with a powerful rich-text editor
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Layers className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">FSRS Flashcards</h3>
              <p className="text-white/70 text-sm">
                Science-backed spaced repetition for long-term retention
              </p>
            </div>
          </div>
        </div>

        <div className="text-white/50 text-sm">
          &copy; {new Date().getFullYear()} MedGPT. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="size-12 rounded-xl bg-blue-primary flex items-center justify-center">
              <GraduationCap className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">MedGPT</h1>
              <p className="text-text-secondary text-sm">Student Platform</p>
            </div>
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
