import { ArrowRight } from 'lucide-react';

interface QuickTopicChipsProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
}

export function QuickTopicChips({ topics, onTopicClick }: QuickTopicChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic, index) => (
        <button
          key={index}
          onClick={() => onTopicClick(topic)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1F1F] border border-[#2563EB] text-[#2563EB] rounded-full hover:bg-[#2563EB]/10 transition-colors text-sm"
        >
          <span>{topic}</span>
          <ArrowRight className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
