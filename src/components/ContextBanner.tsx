import { Button } from './ui/button';
import { X, MessageCircle, CreditCard } from 'lucide-react';

interface ContextBannerProps {
  timeSpent: number;
  textbook: string;
  topics: string[];
  flashcardsCreated: number;
  onHide: () => void;
  onViewConversation: () => void;
}

export function ContextBanner({
  timeSpent,
  textbook,
  topics,
  flashcardsCreated,
  onHide,
  onViewConversation,
}: ContextBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border border-[#93C5FD] rounded-xl p-5 shadow-[0_2px_8px_rgba(37,99,235,0.1)]">
      <button
        onClick={onHide}
        className="absolute top-4 right-4 size-5 flex items-center justify-center text-[#1E40AF] hover:text-[#1E3A8A]"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-start gap-3">
        <span className="text-2xl">✨</span>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg text-[#1E40AF]">Welcome back!</h3>
          <p className="text-[#1E40AF]">
            You spent {timeSpent} minutes learning about acute appendicitis with MedChat using{' '}
            {textbook}.
          </p>
          <p className="text-sm text-[#64748B] italic">
            Topics covered: {topics.join(', ')}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewConversation}
              className="h-9 text-[#2563EB] border-[#2563EB] bg-transparent hover:bg-[#EFF6FF]"
            >
              <MessageCircle className="size-3.5 mr-2" />
              View Full Conversation
            </Button>
            {flashcardsCreated > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-[#2563EB] border-[#2563EB] bg-transparent hover:bg-[#EFF6FF]"
              >
                <CreditCard className="size-3.5 mr-2" />
                {flashcardsCreated} Flashcards Created
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
