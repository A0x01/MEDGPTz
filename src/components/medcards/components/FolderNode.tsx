import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  FolderOpen,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  Move,
  FolderPlus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Folder } from '../types';
import { cn } from '../../../lib/utils';

interface FolderNodeProps {
  folder: Folder;
  depth: number;
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
  onCreateSubfolder: (parentId: string) => void;
  onRename: (folderId: string) => void;
  onDelete: (folderId: string) => void;
  onMove: (folderId: string) => void;
}

export function FolderNode({
  folder,
  depth,
  isSelected,
  onSelect,
  onToggleExpand,
  onCreateSubfolder,
  onRename,
  onDelete,
  onMove,
}: FolderNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const isEmpty = folder.deckCount === 0 && folder.cardCount === 0;

  return (
    <div>
      {/* Folder Row */}
      <div
        className={cn(
          'group flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors',
          isSelected && 'bg-blue-primary/10 border-l-2 border-blue-primary',
          !isSelected && isHovered && 'bg-bg-tertiary',
          'hover:bg-bg-tertiary'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(folder.id)}
      >
        {/* Expand/Collapse Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(folder.id);
          }}
          className="size-4 flex items-center justify-center hover:bg-bg-secondary rounded"
        >
          {hasChildren ? (
            folder.isExpanded ? (
              <ChevronDown className="size-3.5 text-text-tertiary" />
            ) : (
              <ChevronRight className="size-3.5 text-text-tertiary" />
            )
          ) : (
            <div className="size-3.5" />
          )}
        </button>

        {/* Folder Icon */}
        <div className="flex items-center justify-center">
          {folder.isExpanded && hasChildren ? (
            <FolderOpen className="size-4" style={{ color: folder.color || '#6B7280' }} />
          ) : (
            <FolderIcon className="size-4" style={{ color: folder.color || '#6B7280' }} />
          )}
        </div>

        {/* Folder Name */}
        <span
          className={cn(
            'flex-1 text-sm truncate',
            isSelected ? 'text-blue-primary' : 'text-text-primary'
          )}
        >
          {folder.name}
        </span>

        {/* Item Count Badge */}
        {!isEmpty && (
          <span className="text-xs text-text-tertiary bg-bg-tertiary px-1.5 py-0.5 rounded">
            {folder.deckCount + folder.cardCount}
          </span>
        )}

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button
              className={cn(
                'p-1 rounded hover:bg-bg-secondary transition-opacity',
                isHovered || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              <MoreVertical className="size-3.5 text-text-tertiary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-bg-secondary border-border-primary w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onCreateSubfolder(folder.id);
              }}
              className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
            >
              <FolderPlus className="size-4 mr-2" />
              New Subfolder
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border-primary" />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename(folder.id);
              }}
              className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
            >
              <Edit2 className="size-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onMove(folder.id);
              }}
              className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
            >
              <Move className="size-4 mr-2" />
              Move
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border-primary" />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder.id);
              }}
              className="text-red-500 hover:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {folder.isExpanded && hasChildren && (
        <div>
          {folder.children!.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              depth={depth + 1}
              isSelected={isSelected && child.id === folder.id}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              onCreateSubfolder={onCreateSubfolder}
              onRename={onRename}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
