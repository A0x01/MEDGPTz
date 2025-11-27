import { BookOpen, Sparkles, Bot, Stethoscope } from 'lucide-react';
import { useEffect, useState } from 'react';

const searchPhrases = [
  'Analyzing medical literature',
  'Cross-referencing Harrison\'s',
  'Reviewing Step Up to Medicine',
  'Checking First Aid Step 2 CK',
  'Synthesizing evidence-based answers'
];

export function LoadingBubble() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % searchPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3">
      {/* MedGPT Robot Avatar */}
      <div className="size-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center flex-shrink-0 relative shadow-lg shadow-[#2563EB]/20">
        <div className="relative">
          <Bot className="size-4 text-white" strokeWidth={2.5} />
          <Stethoscope className="size-2.5 text-[#60A5FA] absolute -bottom-0.5 -right-0.5" strokeWidth={2} />
        </div>
        <div className="absolute inset-0 rounded-full bg-[#2563EB] animate-ping opacity-20" />
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3B82F6] to-transparent opacity-50 blur-sm" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-gradient-to-br from-[#2F2F2F] to-[#252525] rounded-2xl rounded-tl-md px-5 py-4 relative overflow-hidden border border-[#404040]/50">
          {/* Animated gradient background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} 
            />
          </div>
          
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent animate-scan" />
          
          <div className="flex items-center gap-3 text-[#B4B4B4] relative z-10">
            {/* Animated icon */}
            <div className="relative flex items-center justify-center">
              <BookOpen className="size-4.5 text-[#3B82F6] animate-pulse" />
              <Sparkles className="size-3 text-[#60A5FA] absolute -top-1 -right-1 animate-sparkle" />
            </div>
            
            <div className="flex flex-col gap-1">
              {/* Main text */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#E5E7EB]">Scanning textbook</span>
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                  <span className="w-1 h-1 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }} />
                  <span className="w-1 h-1 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }} />
                </div>
              </div>
              
              {/* Rotating contextual phrases */}
              <span className="text-xs text-[#707070] animate-fadeInOut h-4 block">
                {searchPhrases[phraseIndex]}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#404040]/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] animate-progress" />
          </div>
        </div>
      </div>
    </div>
  );
}