import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { FolderPlus, Home } from 'lucide-react';
import { Folder } from '../types';
import { FolderNode } from './FolderNode';
import { buildFolderTree } from '../utils/folderUtils';

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onToggleExpand: (folderId: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onCreateSubfolder: (parentId: string) => void;
  onRenameFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveFolder: (folderId: string) => void;
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onToggleExpand,
  onCreateFolder,
  onCreateSubfolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
}: FolderTreeProps) {
  const folderTree = buildFolderTree(folders);

  return (
    <div className="flex flex-col h-full border-r border-border-primary bg-bg-secondary">
      {/* Header */}
      <div className="p-3 border-b border-border-primary">
        <h2 className="text-sm text-text-secondary mb-3">Folders</h2>
        <Button
          onClick={() => onCreateFolder(null)}
          size="sm"
          className="w-full bg-blue-primary hover:bg-blue-hover text-white"
        >
          <FolderPlus className="size-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* All Decks - Root View */}
      <div className="px-2 py-2">
        <div
          onClick={() => onSelectFolder(null)}
          className={`flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition-colors ${
            selectedFolderId === null
              ? 'bg-blue-primary/10 border-l-2 border-blue-primary'
              : 'hover:bg-bg-tertiary'
          }`}
        >
          <Home className="size-4 text-blue-primary" />
          <span
            className={`text-sm ${
              selectedFolderId === null ? 'text-blue-primary' : 'text-text-primary'
            }`}
          >
            All Decks
          </span>
        </div>
      </div>

      {/* Folder Tree */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 py-2">
          {folderTree.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              depth={0}
              isSelected={selectedFolderId === folder.id}
              onSelect={onSelectFolder}
              onToggleExpand={onToggleExpand}
              onCreateSubfolder={onCreateSubfolder}
              onRename={onRenameFolder}
              onDelete={onDeleteFolder}
              onMove={onMoveFolder}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Empty State */}
      {folderTree.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <FolderPlus className="size-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No folders yet</p>
            <p className="text-xs text-text-tertiary mt-1">Create your first folder</p>
          </div>
        </div>
      )}
    </div>
  );
}
