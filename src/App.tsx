import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { MedQuizAPI } from './components/MedQuizAPI';
import { MedNotesAPI } from './components/MedNotesAPI';
import { MedCardsAPI } from './components/MedCardsAPI';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthPage } from './components/auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Menu, Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentModule, setCurrentModule] = useState<'chat' | 'quiz' | 'notes' | 'cards' | 'profile' | 'settings' | 'admin'>('chat');
  const [selectedTextbook, setSelectedTextbook] = useState('step-up');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [messages, setMessages] = useState<any[]>([]);

  // Initialize and handle theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, [theme]);

  const handleNewChat = () => {
    // New chat logic
    setMessages([]);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-blue-primary" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main app when authenticated
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bg-secondary border-b border-border-primary p-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="text-text-primary hover:bg-bg-tertiary"
        >
          <Menu className="size-5" />
        </Button>
        <h1 className="text-text-primary">MedGPT</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentModule={currentModule}
        onModuleChange={(module) => {
          setCurrentModule(module);
          setIsSidebarOpen(false);
        }}
        selectedTextbook={selectedTextbook}
        onTextbookChange={setSelectedTextbook}
        onNewChat={handleNewChat}
        theme={theme}
        onThemeChange={setTheme}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col mt-[56px] md:mt-0 overflow-hidden transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'md:ml-0' : 'md:ml-[260px]'
      }`}>
        {currentModule === 'chat' && (
          <ChatArea
            messages={messages}
            currentModule={currentModule}
            selectedTextbook={selectedTextbook}
            onTextbookChange={setSelectedTextbook}
          />
        )}
        {currentModule === 'quiz' && <MedQuizAPI />}
        {currentModule === 'notes' && <MedNotesAPI />}
        {currentModule === 'cards' && <MedCardsAPI />}
        {currentModule === 'profile' && <Profile />}
        {currentModule === 'settings' && <Settings theme={theme} onThemeChange={setTheme} />}
        {currentModule === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
