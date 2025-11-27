import { Progress } from '../../ui/progress';
import { Sparkles } from 'lucide-react';

interface GeneratingViewProps {
  progress: number;
}

export function GeneratingView({ progress }: GeneratingViewProps) {
  const getStatusText = () => {
    if (progress < 30) return 'Analyzing document...';
    if (progress < 60) return 'Extracting key concepts...';
    if (progress < 90) return 'Generating cards...';
    return 'Finalizing...';
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <div className="size-20 rounded-full bg-blue-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="size-10 text-blue-primary" />
          </div>
          <h2 className="text-2xl text-text-primary mb-2">Generating Flashcards...</h2>
          <p className="text-text-secondary">
            AI is analyzing your document and creating high-yield flashcards
          </p>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-tertiary">{progress}% complete</span>
            <span className="text-text-primary">{getStatusText()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
