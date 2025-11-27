import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import {
  PenSquare,
  Search,
  HelpCircle,
  FileText,
  CreditCard,
  BookOpen,
  Star,
  Plus,
  User,
  Settings,
  Moon,
  Sun,
  X,
  Shield,
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentModule: 'chat' | 'quiz' | 'notes' | 'cards' | 'profile' | 'settings' | 'admin';
  onModuleChange: (module: 'chat' | 'quiz' | 'notes' | 'cards' | 'profile' | 'settings' | 'admin') => void;
  selectedTextbook: string;
  onTextbookChange: (textbook: string) => void;
  onNewChat: () => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  isCollapsed: boolean;
  onCollapseToggle: (collapsed: boolean) => void;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

const chatHistoryData: ChatHistory[] = [
  { id: '1', title: 'Beta blocker mechanism of action', timestamp: new Date() },
  { id: '2', title: 'Chest pain differential diagnosis', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '3', title: 'STEMI management protocol', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '4', title: 'Diabetic ketoacidosis treatment', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '5', title: 'Pneumonia antibiotic coverage', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: '6', title: 'Hypertensive emergency management', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
];

const textbooks = [
  { id: 'step-up', name: 'Step Up to Medicine', favorite: true },
  { id: 'first-aid', name: 'First Aid Step 2 CK', favorite: true },
  { id: 'harrisons', name: "Harrison's Internal Medicine", favorite: false },
  { id: 'robbins', name: 'Robbins Basic Pathology', favorite: false },
  { id: 'master-boards', name: 'Master the Boards Step 2', favorite: false },
  { id: 'toronto', name: 'Toronto Notes', favorite: false },
];

export function Sidebar({
  isOpen,
  onClose,
  currentModule,
  onModuleChange,
  selectedTextbook,
  onTextbookChange,
  onNewChat,
  theme,
  onThemeChange,
  isCollapsed,
  onCollapseToggle,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [textbookSearchQuery, setTextbookSearchQuery] = useState('');

  const groupChatsByTime = (chats: ChatHistory[]) => {
    const now = new Date();
    const today: ChatHistory[] = [];
    const yesterday: ChatHistory[] = [];
    const previous7Days: ChatHistory[] = [];
    const previous30Days: ChatHistory[] = [];

    chats.forEach((chat) => {
      const diff = now.getTime() - chat.timestamp.getTime();
      const daysDiff = diff / (1000 * 60 * 60 * 24);

      if (daysDiff < 1) {
        today.push(chat);
      } else if (daysDiff < 2) {
        yesterday.push(chat);
      } else if (daysDiff < 7) {
        previous7Days.push(chat);
      } else {
        previous30Days.push(chat);
      }
    });

    return { today, yesterday, previous7Days, previous30Days };
  };

  const { today, yesterday, previous7Days, previous30Days } = groupChatsByTime(chatHistoryData);

  // Filter textbooks based on search query
  const filteredTextbooks = textbooks.filter((book) =>
    book.name.toLowerCase().includes(textbookSearchQuery.toLowerCase())
  );

  const renderChatGroup = (title: string, chats: ChatHistory[]) => {
    if (chats.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="px-3 py-2 text-xs text-text-secondary">{title}</div>
        {chats.map((chat) => (
          <button
            key={chat.id}
            className="w-full px-3 py-2 text-left rounded-lg hover:bg-bg-tertiary transition-colors group"
          >
            <div className="text-sm truncate text-text-primary">{chat.title}</div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Show Sidebar Button - When Collapsed on Desktop */}
      {isCollapsed && (
        <div className="hidden md:block fixed top-4 left-4 z-50 animate-fadeIn">
          <button
            onClick={() => onCollapseToggle(false)}
            className="group flex items-center justify-center bg-bg-secondary hover:bg-blue-primary text-text-secondary hover:text-white border border-border-primary hover:border-blue-primary h-10 w-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            title="Show Sidebar"
            type="button"
          >
            <PanelLeft className="size-5 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-bg-secondary flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'w-0 border-0 md:-translate-x-full' : 'w-[260px] border-r border-border-primary'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {!isCollapsed && (
          <>
            {/* Mobile close button */}
            <div className="md:hidden absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-text-primary hover:bg-bg-tertiary"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Logo and New Chat */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🩺</div>
                  <span className="text-xl text-text-primary">MedGPT</span>
                </div>
                <button
                  onClick={() => onCollapseToggle(true)}
                  className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-blue-primary transition-all duration-200 cursor-pointer group"
                  title="Hide Sidebar"
                  type="button"
                >
                  <PanelLeftClose className="size-4 transition-transform duration-200 group-hover:scale-110" />
                </button>
              </div>

              <Button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full bg-blue-primary hover:bg-blue-hover text-white"
              >
                <PenSquare className="size-4 mr-2" />
                New Chat
              </Button>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-bg-tertiary border-border-primary text-text-primary placeholder:text-text-tertiary"
                />
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-2">
              {/* Navigation Modules */}
              <div className="py-4">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    currentModule === 'quiz'
                      ? 'bg-blue-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                  onClick={() => {
                    onModuleChange('quiz');
                    onClose();
                  }}
                >
                  <HelpCircle className="size-4 mr-2" />
                  MedQuiz
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    currentModule === 'notes'
                      ? 'bg-blue-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                  onClick={() => {
                    onModuleChange('notes');
                    onClose();
                  }}
                >
                  <FileText className="size-4 mr-2" />
                  MedNotes
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    currentModule === 'cards'
                      ? 'bg-blue-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                  onClick={() => {
                    onModuleChange('cards');
                    onClose();
                  }}
                >
                  <CreditCard className="size-4 mr-2" />
                  MedCards
                </Button>
              </div>

              {/* Textbooks Section */}
              <div className="py-4 border-t border-border-primary">
                <div className="px-3 py-2 text-xs text-text-secondary flex items-center justify-between">
                  <span>Textbooks</span>
                </div>
                {/* Textbook Search */}
                <div className="px-3 mb-2">
                  <div className="relative group">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-3.5 transition-colors duration-200 ${
                      textbookSearchQuery ? 'text-blue-primary' : 'text-text-tertiary'
                    }`} />
                    <Input
                      placeholder="Search textbooks..."
                      value={textbookSearchQuery}
                      onChange={(e) => setTextbookSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-sm bg-bg-tertiary border-border-primary text-text-primary placeholder:text-text-tertiary focus:border-blue-primary transition-all duration-200"
                    />
                    {textbookSearchQuery && (
                      <button
                        onClick={() => setTextbookSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 size-5 rounded-full hover:bg-bg-secondary flex items-center justify-center transition-colors duration-200"
                      >
                        <X className="size-3 text-text-tertiary" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-0.5">
                  {filteredTextbooks.length > 0 ? (
                    filteredTextbooks.map((book, index) => (
                      <button
                        key={book.id}
                        onClick={() => {
                          onTextbookChange(book.id);
                          onClose();
                        }}
                        style={{
                          animationDelay: `${index * 30}ms`,
                        }}
                        className={`w-full px-3 py-2 text-left rounded-lg hover:bg-bg-tertiary transition-all duration-200 flex items-center gap-3 group animate-fadeIn ${
                          selectedTextbook === book.id ? 'bg-blue-primary' : ''
                        }`}
                      >
                        <div className="size-6 flex-shrink-0 rounded bg-bg-tertiary flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                          <BookOpen className="size-3.5" />
                        </div>
                        <span className="text-sm truncate flex-1">{book.name}</span>
                        {book.favorite && (
                          <Star className="size-3 fill-[#FBBF24] text-[#FBBF24] flex-shrink-0 transition-transform duration-200 group-hover:scale-125" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-6 text-center animate-fadeIn">
                      <div className="text-text-tertiary text-sm mb-1">No textbooks found</div>
                      <div className="text-text-tertiary text-xs">Try a different search term</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat History */}
              <div className="border-t border-border-primary pt-4">
                {renderChatGroup('Today', today)}
                {renderChatGroup('Yesterday', yesterday)}
                {renderChatGroup('Previous 7 Days', previous7Days)}
                {renderChatGroup('Previous 30 Days', previous30Days)}
              </div>

              {/* User Profile & Settings */}
              <div className="py-4 border-t border-border-primary">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    currentModule === 'profile'
                      ? 'bg-blue-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                  onClick={() => {
                    onModuleChange('profile');
                    onClose();
                  }}
                >
                  <User className="size-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    currentModule === 'settings'
                      ? 'bg-blue-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                  onClick={() => {
                    onModuleChange('settings');
                    onClose();
                  }}
                >
                  <Settings className="size-4 mr-2" />
                  Settings
                </Button>
                
                <div className="pt-2 border-t border-border-primary space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full justify-start text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="size-4 mr-2" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="size-4 mr-2" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <LogOut className="size-4 mr-2" />
                    Sign Out
                  </Button>
                </div>

                {/* Current user info */}
                {user && (
                  <div className="pt-3 border-t border-border-primary">
                    <div className="px-2 py-2 rounded-lg bg-bg-tertiary">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}