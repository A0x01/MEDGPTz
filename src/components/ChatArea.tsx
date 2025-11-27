import { Button } from './ui/button';
import { MessageBubble } from './MessageBubble';
import { LoadingBubble } from './LoadingBubble';
import { Download, Trash2, Share2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: Array<{
    book: string;
    chapter: string;
    page: string;
  }>;
  isTyping?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  currentModule: 'chat' | 'quiz' | 'notes' | 'cards';
  selectedTextbook: string;
  onTextbookChange: (textbook: string) => void;
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

const exampleQuestions = [
  {
    icon: '💊',
    text: 'Explain the MOA of beta blockers',
  },
  {
    icon: '🫀',
    text: "What's the differential for chest pain?",
  },
  {
    icon: '🩺',
    text: 'STEMI management protocol',
  },
  {
    icon: '🧪',
    text: 'Interpret these lab results...',
  },
];

export function ChatArea({
  messages = [],
  currentModule,
  selectedTextbook,
  onTextbookChange,
  isLoading,
  onSendMessage,
}: ChatAreaProps) {
  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="border-b border-border-primary px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl">💬</span>
            <span className="text-base md:text-lg">MedChat</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
          >
            <Download className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
          >
            <Share2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-3xl w-full space-y-8">
              {/* Logo and tagline */}
              <div className="text-center space-y-4">
                <div className="text-6xl">🩺</div>
                <div>
                  <h1 className="text-3xl mb-2">Your AI Medical Tutor</h1>
                  <p className="text-text-secondary">
                    Trained on USMLE Step 2 CK Textbooks
                  </p>
                </div>
              </div>

              {/* Example questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage?.(question.text)}
                    className="p-4 bg-bg-tertiary hover:bg-bg-tertiary/80 border border-border-primary rounded-xl text-left transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{question.icon}</span>
                      <span className="text-sm">{question.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && !messages.some(msg => msg.type === 'ai' && msg.isTyping) && <LoadingBubble />}
          </div>
        )}
      </div>
    </div>
  );
}