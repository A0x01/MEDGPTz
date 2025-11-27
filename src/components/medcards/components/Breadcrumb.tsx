import { ChevronRight, Home } from 'lucide-react';
import { Folder } from '../types';
import { cn } from '../../../lib/utils';

interface BreadcrumbProps {
  path: Folder[];
  onNavigate: (folderId: string | null) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  if (path.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Home className="size-4 text-blue-primary" />
        <span className="text-text-primary">All Decks</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm overflow-x-auto">
      {/* Home */}
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 hover:text-blue-primary transition-colors text-text-tertiary hover:bg-bg-tertiary px-2 py-1 rounded"
      >
        <Home className="size-3.5" />
        <span>All</span>
      </button>

      {/* Path segments */}
      {path.map((folder, index) => {
        const isLast = index === path.length - 1;
        return (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="size-3.5 text-text-tertiary" />
            <button
              onClick={() => onNavigate(folder.id)}
              className={cn(
                'px-2 py-1 rounded transition-colors truncate max-w-[200px]',
                isLast
                  ? 'text-text-primary pointer-events-none'
                  : 'text-text-tertiary hover:text-blue-primary hover:bg-bg-tertiary'
              )}
            >
              {folder.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}
