import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Search, Download, Plus, FolderOpen } from 'lucide-react';
import { Deck, Folder } from '../types';
import { DeckCard } from '../components/DeckCard';
import { FolderTree } from '../components/FolderTree';
import { Breadcrumb } from '../components/Breadcrumb';
import { FolderDialog } from '../components/FolderDialog';
import { MoveFolderDialog } from '../components/MoveFolderDialog';
import { getFolderPath } from '../utils/folderUtils';

interface DeckListViewProps {
  decks: Deck[];
  folders: Folder[];
  selectedFolderId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectFolder: (folderId: string | null) => void;
  onToggleFolderExpand: (folderId: string) => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveFolder: (folderId: string, newParentId: string | null) => void;
  onDeckSelect: (deck: Deck) => void;
  onExportDeck: (deck: Deck) => void;
  onImportAnki: () => void;
  onCreateDeck: () => void;
}

export function DeckListView({
  decks,
  folders,
  selectedFolderId,
  searchQuery,
  onSearchChange,
  onSelectFolder,
  onToggleFolderExpand,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  onDeckSelect,
  onExportDeck,
  onImportAnki,
  onCreateDeck,
}: DeckListViewProps) {
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderDialogMode, setFolderDialogMode] = useState<'create' | 'rename'>('create');
  const [folderDialogParent, setFolderDialogParent] = useState<Folder | null>(null);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [moveFolderDialogOpen, setMoveFolderDialogOpen] = useState(false);
  const [folderToMove, setFolderToMove] = useState<Folder | null>(null);

  // Filter decks by selected folder
  const filteredDecks = selectedFolderId
    ? decks.filter((d) => d.folderId === selectedFolderId)
    : decks;

  // Further filter by search query
  const searchedDecks = searchQuery
    ? filteredDecks.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredDecks;

  // Get breadcrumb path
  const breadcrumbPath = getFolderPath(selectedFolderId, folders);

  // Get current folder for empty state
  const currentFolder = folders.find((f) => f.id === selectedFolderId);

  const handleCreateFolderClick = (parentId: string | null) => {
    const parent = parentId ? folders.find((f) => f.id === parentId) : null;
    setFolderDialogParent(parent || null);
    setFolderDialogMode('create');
    setFolderDialogOpen(true);
  };

  const handleRenameFolderClick = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      setFolderToEdit(folder);
      setFolderDialogMode('rename');
      setFolderDialogOpen(true);
    }
  };

  const handleMoveFolderClick = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      setFolderToMove(folder);
      setMoveFolderDialogOpen(true);
    }
  };

  const handleFolderDialogSubmit = (name: string, parentId: string | null) => {
    if (folderDialogMode === 'create') {
      onCreateFolder(name, parentId);
    } else if (folderToEdit) {
      onRenameFolder(folderToEdit.id, name);
    }
  };

  return (
    <>
      <div className="flex-1 flex">
        {/* Folder Sidebar */}
        <div className="w-64 flex-shrink-0">
          <FolderTree
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={onSelectFolder}
            onToggleExpand={onToggleFolderExpand}
            onCreateFolder={handleCreateFolderClick}
            onCreateSubfolder={(parentId) => handleCreateFolderClick(parentId)}
            onRenameFolder={handleRenameFolderClick}
            onDeleteFolder={onDeleteFolder}
            onMoveFolder={handleMoveFolderClick}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
            {/* Breadcrumb */}
            <div className="mb-4">
              <Breadcrumb path={breadcrumbPath} onNavigate={onSelectFolder} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl text-text-primary mb-1">
                  {selectedFolderId ? currentFolder?.name || 'Folder' : 'All Decks'}
                </h1>
                <p className="text-sm text-text-secondary">
                  {searchedDecks.length} deck{searchedDecks.length !== 1 ? 's' : ''}
                  {selectedFolderId && ' in this folder'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onImportAnki}
                  variant="outline"
                  className="border-border-primary text-text-primary hover:bg-bg-tertiary"
                >
                  <Download className="size-4 mr-2" />
                  Import Anki
                </Button>
                <Button
                  onClick={onCreateDeck}
                  className="bg-blue-primary hover:bg-blue-hover text-white"
                >
                  <Plus className="size-4 mr-2" />
                  New Deck
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
              <Input
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-bg-tertiary border-border-primary text-text-primary"
              />
            </div>
          </div>

          {/* Decks Grid */}
          <ScrollArea className="flex-1">
            {searchedDecks.length > 0 ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchedDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    onClick={() => onDeckSelect(deck)}
                    onExport={() => onExportDeck(deck)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className="size-16 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="size-8 text-text-tertiary" />
                  </div>
                  <h3 className="text-lg text-text-primary mb-2">
                    {searchQuery ? 'No decks found' : 'This folder is empty'}
                  </h3>
                  <p className="text-sm text-text-secondary mb-6">
                    {searchQuery
                      ? 'Try a different search term'
                      : selectedFolderId
                      ? 'Add your first deck to this folder'
                      : 'Create your first deck to get started'}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={onCreateDeck}
                      className="bg-blue-primary hover:bg-blue-hover text-white"
                    >
                      <Plus className="size-4 mr-2" />
                      Create First Deck
                    </Button>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Dialogs */}
      <FolderDialog
        open={folderDialogOpen}
        mode={folderDialogMode}
        parentFolder={folderDialogParent}
        existingFolder={folderToEdit}
        onOpenChange={setFolderDialogOpen}
        onSubmit={handleFolderDialogSubmit}
      />

      <MoveFolderDialog
        open={moveFolderDialogOpen}
        folder={folderToMove}
        allFolders={folders}
        onOpenChange={setMoveFolderDialogOpen}
        onMove={onMoveFolder}
      />
    </>
  );
}
