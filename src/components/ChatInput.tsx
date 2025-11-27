import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Plus, Mic, Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
}

export function ChatInput({ onSendMessage, isLoading, onStopGeneration }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading && onStopGeneration) {
      // Stop generation if loading
      onStopGeneration();
    } else if (message.trim() && !isLoading) {
      // Send message if not loading
      onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border-primary p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-bg-tertiary border border-border-primary rounded-xl p-2 focus-within:border-blue-primary transition-colors">
            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask MedGPT anything..."
              className="flex-1 min-h-[44px] max-h-[200px] bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-text-primary placeholder:text-text-tertiary px-2"
              rows={1}
            />

            {/* Send/Stop button */}
            <Button
              type="submit"
              size="sm"
              disabled={!isLoading && !message.trim()}
              className={`${
                isLoading 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-primary hover:bg-blue-hover disabled:bg-border-primary disabled:text-text-tertiary'
              } flex-shrink-0 rounded-lg transition-colors`}
            >
              {isLoading ? <Square className="size-5" /> : <Send className="size-5" />}
            </Button>
          </div>
        </form>

        {/* Helper text */}
        <div className="mt-2 text-center">
          <p className="text-xs text-text-tertiary">
            MedGPT can make mistakes. Verify important information with textbooks.
          </p>
        </div>
      </div>
    </div>
  );
}