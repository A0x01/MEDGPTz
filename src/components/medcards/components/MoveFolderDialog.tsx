import { useState } from 'react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Folder, Home, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Folder as FolderType } from '../types';
import { buildFolderTree, getDescendantIds } from '../utils/folderUtils';
import { cn } from '../../../lib/utils';

interface MoveFolderDialogProps {
  open: boolean;
  folder: FolderType | null;
  allFolders: FolderType[];
  onOpenChange: (open: boolean) => void;
  onMove: (folderId: string, newParentId: string | null) => void;
}

export function MoveFolderDialog({
  open,
  folder,
  allFolders,
  onOpenChange,
  onMove,
}: MoveFolderDialogProps) {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  if (!folder) return null;

  // Get IDs that can't be selected (folder itself and its descendants)
  const invalidIds = getDescendantIds(folder.id, allFolders);

  // Filter valid folders
  const validFolders = allFolders.filter((f) => !invalidIds.includes(f.id));
  const folderTree = buildFolderTree(validFolders);

  const handleMove = () => {
    if (selectedParentId === folder.parentId) {
      toast.info('Folder is already in this location');
      onOpenChange(false);
      return;
    }

    onMove(folder.id, selectedParentId);
    setSelectedParentId(null);
    onOpenChange(false);
  };

  const renderFolderOption = (f: FolderType, depth: number = 0) => (
    <div key={f.id}>
      <button
        onClick={() => setSelectedParentId(f.id)}
        className={cn(
          'w-full flex items-center gap-2 py-2 px-3 rounded-md text-left transition-colors',
          selectedParentId === f.id
            ? 'bg-blue-primary/10 border-l-2 border-blue-primary'
            : 'hover:bg-bg-tertiary'
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <Folder className="size-4" style={{ color: f.color }} />
        <span className="text-sm text-text-primary truncate">{f.name}</span>
        {selectedParentId === f.id && (
          <ChevronRight className="size-4 text-blue-primary ml-auto" />
        )}
      </button>
      {f.children &&
        f.children.map((child) => renderFolderOption(child, depth + 1))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bg-secondary border-border-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Move Folder</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Choose a new location for "{folder.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Current Location */}
          <div className="bg-bg-tertiary p-3 rounded-md">
            <div className="text-xs text-text-tertiary mb-1">Current Location</div>
            <div className="flex items-center gap-2">
              <Folder className="size-4" style={{ color: folder.color }} />
              <span className="text-sm text-text-primary">{folder.name}</span>
            </div>
          </div>

          {/* Destination Picker */}
          <div>
            <label className="text-sm text-text-secondary mb-2 block">
              Select Destination
            </label>
            <div className="border border-border-primary rounded-lg bg-bg-primary">
              <ScrollArea className="h-[300px]">
                <div className="p-2 space-y-1">
                  {/* Root Option */}
                  <button
                    onClick={() => setSelectedParentId(null)}
                    className={cn(
                      'w-full flex items-center gap-2 py-2 px-3 rounded-md text-left transition-colors',
                      selectedParentId === null
                        ? 'bg-blue-primary/10 border-l-2 border-blue-primary'
                        : 'hover:bg-bg-tertiary'
                    )}
                  >
                    <Home className="size-4 text-blue-primary" />
                    <span className="text-sm text-text-primary">Root (No parent)</span>
                    {selectedParentId === null && (
                      <ChevronRight className="size-4 text-blue-primary ml-auto" />
                    )}
                  </button>

                  {/* Folder Tree */}
                  {folderTree.map((f) => renderFolderOption(f))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedParentId(null);
            }}
            className="border-border-primary text-text-primary hover:bg-bg-tertiary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            className="bg-blue-primary hover:bg-blue-hover text-white"
          >
            Move Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
