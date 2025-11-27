import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Folder, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { Folder as FolderType } from '../types';

interface FolderDialogProps {
  open: boolean;
  mode: 'create' | 'rename';
  parentFolder?: FolderType | null;
  existingFolder?: FolderType;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, parentId: string | null) => void;
}

export function FolderDialog({
  open,
  mode,
  parentFolder,
  existingFolder,
  onOpenChange,
  onSubmit,
}: FolderDialogProps) {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (open) {
      setFolderName(existingFolder?.name || '');
    }
  }, [open, existingFolder]);

  const handleSubmit = () => {
    if (!folderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    const parentId = mode === 'create' ? (parentFolder?.id || null) : existingFolder?.parentId || null;
    onSubmit(folderName.trim(), parentId);
    setFolderName('');
    onOpenChange(false);
  };

  const getTitle = () => {
    if (mode === 'rename') return 'Rename Folder';
    if (parentFolder) return 'Create Subfolder';
    return 'Create New Folder';
  };

  const getDescription = () => {
    if (mode === 'rename') return `Rename "${existingFolder?.name}"`;
    if (parentFolder) return `Create a new subfolder inside "${parentFolder.name}"`;
    return 'Create a new folder to organize your decks';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bg-secondary border-border-primary">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center gap-2">
            {mode === 'create' ? <FolderPlus className="size-5" /> : <Folder className="size-5" />}
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {parentFolder && mode === 'create' && (
            <div className="bg-bg-tertiary p-3 rounded-md">
              <div className="text-xs text-text-tertiary mb-1">Parent Folder</div>
              <div className="flex items-center gap-2">
                <Folder className="size-4" style={{ color: parentFolder.color }} />
                <span className="text-sm text-text-primary">{parentFolder.name}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-text-secondary mb-2 block">Folder Name</label>
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., Internal Medicine"
              className="bg-bg-tertiary border-border-primary text-text-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFolderName('');
            }}
            className="border-border-primary text-text-primary hover:bg-bg-tertiary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!folderName.trim()}
            className="bg-blue-primary hover:bg-blue-hover text-white"
          >
            {mode === 'rename' ? 'Rename' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
