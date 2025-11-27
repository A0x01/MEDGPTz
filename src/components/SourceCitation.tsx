import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Bookmark } from 'lucide-react';
import { Button } from './ui/button';

interface Source {
  book: string;
  edition: string;
  chapter: string;
  pages: string;
  relevance: number;
  excerpt?: string;
}

interface SourceCitationProps {
  sources: Source[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return '#10B981'; // green
    if (relevance >= 70) return '#3B82F6'; // blue
    return '#F59E0B'; // amber
  };

  const getRelevanceLabel = (relevance: number) => {
    if (relevance >= 90) return 'Very High';
    if (relevance >= 70) return 'High';
    return 'Medium';
  };

  return (
    <div className="bg-[#3F2F1F] border border-[#F59E0B] rounded-lg overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#4F3F2F] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>📚</span>
          <span className="text-sm text-[#2563EB]">
            {isExpanded ? 'Hide' : 'Show'} citation ({sources.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="size-4 text-[#2563EB]" />
        ) : (
          <ChevronDown className="size-4 text-[#2563EB]" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-[#E5E5E5]">Sources Used for This Answer:</p>

          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-[#1F1F1F] border border-[#404040] rounded-lg p-4 space-y-3"
            >
              {/* Book Info */}
              <div className="flex items-start gap-3">
                <BookOpen className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <h4 className="text-white">{source.book}</h4>
                  <p className="text-sm text-[#B4B4B4]">{source.edition}</p>
                </div>
              </div>

              {/* Chapter & Pages */}
              <div className="text-sm text-[#E5E5E5] space-y-1">
                <p>{source.chapter}</p>
                <p className="text-[#B4B4B4]">Pages: {source.pages}</p>
              </div>

              {/* Relevance Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#B4B4B4]">Relevance:</span>
                  <span className="text-white">{getRelevanceLabel(source.relevance)}</span>
                </div>
                <div className="relative h-2 bg-[#2F2F2F] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${source.relevance}%`,
                      backgroundColor: getRelevanceColor(source.relevance),
                    }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              {source.excerpt && (
                <div className="bg-[#2F2F2F] border-l-2 border-[#2563EB] rounded p-3">
                  <p className="text-xs text-[#B4B4B4] mb-1">Key excerpt:</p>
                  <p className="text-sm text-[#E5E5E5] italic">"{source.excerpt}"</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs text-[#2563EB] border-[#2563EB] hover:bg-[#2563EB]/10"
                >
                  <BookOpen className="size-3 mr-1.5" />
                  View Full Page
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-[#B4B4B4] hover:text-white hover:bg-[#2F2F2F]"
                >
                  <Bookmark className="size-3 mr-1.5" />
                  Bookmark
                </Button>
              </div>
            </div>
          ))}

          {sources.length > 1 && (
            <div className="text-sm text-[#B4B4B4]">
              <p className="mb-2">Also consulted:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Harrison's Internal Medicine (Ch 128)</li>
                <li>Robbins Basic Pathology (Ch 17)</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
