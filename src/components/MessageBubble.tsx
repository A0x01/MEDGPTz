import { useState } from 'react';
import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown, Copy, RotateCw, ChevronDown, ChevronUp, BookOpen, FileText, HelpCircle, CreditCard, Bot, Stethoscope } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

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

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.type === 'user') {
    return (
      <div className="flex justify-end items-start gap-3">
        <div className="max-w-[70%] space-y-1">
          <div className="bg-blue-primary text-white rounded-2xl rounded-tr-md px-4 py-3">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="text-xs text-text-tertiary text-right px-2">
            {formatTime(message.timestamp)}
          </div>
        </div>
        <div className="size-8 rounded-full bg-blue-primary flex items-center justify-center flex-shrink-0">
          <span className="text-sm">👤</span>
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex items-start gap-3">
      {/* MedGPT Robot Avatar */}
      <div className="size-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center flex-shrink-0 relative shadow-lg shadow-[#2563EB]/20">
        <div className="relative">
          <Bot className="size-4 text-white" strokeWidth={2.5} />
          <Stethoscope className="size-2.5 text-[#60A5FA] absolute -bottom-0.5 -right-0.5" strokeWidth={2} />
        </div>
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3B82F6] to-transparent opacity-50 blur-sm" />
      </div>
      <div className="max-w-[80%] space-y-3">
        <div className="bg-bg-tertiary rounded-2xl rounded-tl-md px-5 py-4 space-y-4">
          <div className="prose prose-invert dark:prose-invert max-w-none">
            {message.content.split('\n').map((line, i) => {
              // Handle bold text
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={i} className="mb-2">
                    <strong>{line.slice(2, -2)}</strong>
                  </p>
                );
              }
              // Handle bullet points
              if (line.startsWith('• ') || line.startsWith('- ')) {
                return (
                  <li key={i} className="ml-4 mb-1">
                    {line.slice(2)}
                  </li>
                );
              }
              // Handle numbered lists
              if (/^\d+\./.test(line)) {
                return (
                  <li key={i} className="ml-4 mb-1">
                    {line.replace(/^\d+\.\s*/, '')}
                  </li>
                );
              }
              // Regular paragraphs
              return line ? (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ) : (
                <br key={i} />
              );
            })}
            {message.isTyping && (
              <span className="inline-block w-1 h-4 bg-text-primary ml-0.5 animate-pulse" />
            )}
          </div>

          {/* Sources section */}
          {message.sources && message.sources.length > 0 && (
            <Collapsible open={isSourcesOpen} onOpenChange={setIsSourcesOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                <BookOpen className="size-4" />
                <span>Sources ({message.sources.length})</span>
                {isSourcesOpen ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className="p-3 bg-bg-secondary rounded-lg border border-border-primary"
                  >
                    <div className="flex items-start gap-2">
                      <BookOpen className="size-4 text-blue-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{source.book}</div>
                        <div className="text-xs text-text-tertiary">
                          {source.chapter} • Page {source.page}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 px-2">
          {/* Primary action buttons row */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary h-8"
            >
              <ThumbsUp className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary h-8"
            >
              <ThumbsDown className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary h-8"
            >
              <Copy className="size-4" />
              {copied && <span className="ml-1 text-xs">Copied!</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary h-8"
            >
              <RotateCw className="size-4" />
            </Button>
            <span className="text-xs text-text-tertiary ml-auto">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}