/**
 * MedNotes - API Integrated Version
 *
 * Rich text note-taking with folder organization.
 * Integrates with backend API for persistence.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Plus,
  Search,
  FolderPlus,
  FileText,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Folder,
  FolderOpen,
  Edit2,
  Trash2,
  Copy,
  Move,
  Save,
  X,
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Table as TableIcon,
  Image as ImageIcon,
  Paperclip,
  MoreHorizontal,
  History,
  PanelLeftClose,
  PanelLeft,
  Loader2,
  Pin,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import { toast } from 'sonner';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline as UnderlineExtension } from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Image } from '@tiptap/extension-image';
import { notesApi } from '../api';
import type {
  NoteFolder,
  NoteFolderTree,
  NotePreview,
  NoteDetail,
  NoteVersion,
} from '../api/types';

// Extended folder type with expansion state (local UI state)
interface FolderWithExpanded extends NoteFolderTree {
  isExpanded: boolean;
  children: FolderWithExpanded[];
}

export function MedNotesAPI() {
  // Data state
  const [folderTree, setFolderTree] = useState<FolderWithExpanded[]>([]);
  const [notes, setNotes] = useState<NotePreview[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteDetail | null>(null);
  const [versions, setVersions] = useState<NoteVersion[]>([]);

  // Loading states
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // UI state
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isRenameFolderDialogOpen, setIsRenameFolderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderToRename, setFolderToRename] = useState<NoteFolder | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'note'; id: number } | null>(null);
  const [noteToMove, setNoteToMove] = useState<NotePreview | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingNoteTitle, setEditingNoteTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  // Memoize extensions array to prevent recreation
  const extensions = useMemo(
    () => [
      StarterKit.configure({}),
      Highlight,
      UnderlineExtension,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
    ],
    []
  );

  // Initialize the editor with stable extensions
  const editor = useEditor(
    {
      extensions,
      content: '',
      editable: false,
      onUpdate: ({ editor }) => {
        setEditorContent(editor.getHTML());
      },
    },
    []
  );

  // Load folder tree on mount
  useEffect(() => {
    loadFolderTree();
  }, []);

  // Load notes when folder changes
  useEffect(() => {
    loadNotes();
  }, [selectedFolderId, searchQuery]);

  // Update editor content when note changes
  useEffect(() => {
    if (editor && selectedNote) {
      editor.commands.setContent(selectedNote.content || '');
      editor.setEditable(isEditMode);
    }
  }, [selectedNote, editor]);

  // Update editor editable state when edit mode changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditMode);
    }
  }, [isEditMode, editor]);

  // Auto-save functionality
  useEffect(() => {
    if (isEditMode && selectedNote && editorContent) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 3000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorContent, selectedNote, isEditMode, editingNoteTitle]);

  // API Functions
  const loadFolderTree = async () => {
    setLoadingFolders(true);
    try {
      const tree = await notesApi.getFolderTree();
      // Add isExpanded to each folder
      const addExpanded = (folders: NoteFolderTree[]): FolderWithExpanded[] => {
        return folders.map(f => ({
          ...f,
          isExpanded: expandedFolders.has(f.id),
          children: addExpanded(f.children),
        }));
      };
      setFolderTree(addExpanded(tree));
    } catch (err) {
      console.error('Failed to load folders:', err);
      toast.error('Failed to load folders');
    } finally {
      setLoadingFolders(false);
    }
  };

  const loadNotes = async () => {
    setLoadingNotes(true);
    try {
      if (searchQuery.trim()) {
        const response = await notesApi.searchNotes({ q: searchQuery });
        setNotes(response.items);
      } else {
        const response = await notesApi.getNotes({
          folder_id: selectedFolderId ?? undefined,
        });
        setNotes(response.items);
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
      toast.error('Failed to load notes');
    } finally {
      setLoadingNotes(false);
    }
  };

  const loadNote = async (noteId: number) => {
    setLoadingNote(true);
    try {
      const note = await notesApi.getNote(noteId);
      setSelectedNote(note);
      setEditingNoteTitle(note.title);
      setEditorContent(note.content || '');
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to load note:', err);
      toast.error('Failed to load note');
    } finally {
      setLoadingNote(false);
    }
  };

  const loadVersions = async (noteId: number) => {
    setLoadingVersions(true);
    try {
      const response = await notesApi.getVersions(noteId);
      setVersions(response.items);
    } catch (err) {
      console.error('Failed to load versions:', err);
      toast.error('Failed to load version history');
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleAutoSave = async () => {
    if (!selectedNote || savingNote) return;

    setSavingNote(true);
    try {
      await notesApi.updateNote(selectedNote.id, {
        title: editingNoteTitle,
        content: editorContent,
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setSavingNote(false);
    }
  };

  // Toggle folder expansion
  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });

    // Update local folder tree state
    const updateExpanded = (folders: FolderWithExpanded[]): FolderWithExpanded[] => {
      return folders.map(f => ({
        ...f,
        isExpanded: f.id === folderId ? !f.isExpanded : f.isExpanded,
        children: updateExpanded(f.children),
      }));
    };
    setFolderTree(updateExpanded(folderTree));
  };

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await notesApi.createFolder({
        name: newFolderName,
        parent_id: selectedFolderId ?? undefined,
      });
      await loadFolderTree();
      setNewFolderName('');
      setIsNewFolderDialogOpen(false);
      toast.success(`Folder "${newFolderName}" created`);
    } catch (err) {
      console.error('Failed to create folder:', err);
      toast.error('Failed to create folder');
    }
  };

  // Rename folder
  const handleRenameFolder = async () => {
    if (!folderToRename || !newFolderName.trim()) return;

    try {
      await notesApi.updateFolder(folderToRename.id, { name: newFolderName });
      await loadFolderTree();
      setFolderToRename(null);
      setNewFolderName('');
      setIsRenameFolderDialogOpen(false);
      toast.success('Folder renamed');
    } catch (err) {
      console.error('Failed to rename folder:', err);
      toast.error('Failed to rename folder');
    }
  };

  // Delete folder or note
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'folder') {
        await notesApi.deleteFolder(itemToDelete.id, true);
        await loadFolderTree();
        toast.success('Folder deleted');
      } else {
        await notesApi.deleteNote(itemToDelete.id);
        await loadNotes();
        if (selectedNote?.id === itemToDelete.id) {
          setSelectedNote(null);
        }
        toast.success('Note deleted');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error('Failed to delete');
    } finally {
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Create new note
  const handleCreateNote = async () => {
    try {
      const note = await notesApi.createNote({
        title: 'Untitled Note',
        content: '<h1>New Note</h1><p>Start typing...</p>',
        folder_id: selectedFolderId ?? undefined,
      });
      await loadNotes();
      await loadNote(note.id);
      setIsEditMode(true);
      toast.success('New note created');
    } catch (err) {
      console.error('Failed to create note:', err);
      toast.error('Failed to create note');
    }
  };

  // Save note
  const handleSaveNote = async () => {
    if (!selectedNote) return;

    setSavingNote(true);
    try {
      const updated = await notesApi.updateNote(selectedNote.id, {
        title: editingNoteTitle,
        content: editorContent,
      });
      setSelectedNote({ ...selectedNote, ...updated });
      setLastSaved(new Date());
      setIsEditMode(false);
      await loadNotes();
      toast.success('Note saved');
    } catch (err) {
      console.error('Failed to save note:', err);
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  // Toggle pin
  const handleTogglePin = async (noteId: number) => {
    try {
      await notesApi.togglePin(noteId);
      await loadNotes();
      if (selectedNote?.id === noteId) {
        await loadNote(noteId);
      }
      toast.success('Pin toggled');
    } catch (err) {
      console.error('Failed to toggle pin:', err);
      toast.error('Failed to toggle pin');
    }
  };

  // Archive note
  const handleArchiveNote = async (noteId: number, archived: boolean) => {
    try {
      await notesApi.archiveNote(noteId, archived);
      await loadNotes();
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      toast.success(archived ? 'Note archived' : 'Note restored');
    } catch (err) {
      console.error('Failed to archive note:', err);
      toast.error('Failed to archive note');
    }
  };

  // Duplicate note
  const handleDuplicateNote = async (note: NotePreview) => {
    try {
      const original = await notesApi.getNote(note.id);
      await notesApi.createNote({
        title: `${original.title} (Copy)`,
        content: original.content,
        folder_id: original.folder_id,
        tags: original.tags,
      });
      await loadNotes();
      toast.success('Note duplicated');
    } catch (err) {
      console.error('Failed to duplicate note:', err);
      toast.error('Failed to duplicate note');
    }
  };

  // Move note to folder
  const handleMoveNote = async (folderId: number | null) => {
    if (!noteToMove) return;

    try {
      await notesApi.updateNote(noteToMove.id, {
        folder_id: folderId ?? undefined,
      });
      await loadNotes();
      setNoteToMove(null);
      setIsMoveDialogOpen(false);
      toast.success('Note moved');
    } catch (err) {
      console.error('Failed to move note:', err);
      toast.error('Failed to move note');
    }
  };

  // Restore version
  const handleRestoreVersion = async (versionId: number) => {
    if (!selectedNote) return;

    try {
      await notesApi.restoreVersion(selectedNote.id, versionId);
      await loadNote(selectedNote.id);
      setIsVersionHistoryOpen(false);
      toast.success('Version restored');
    } catch (err) {
      console.error('Failed to restore version:', err);
      toast.error('Failed to restore version');
    }
  };

  // Render folder tree recursively
  const renderFolder = (folder: FolderWithExpanded, level: number = 0) => {
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group hover:bg-bg-tertiary transition-colors ${
            isSelected ? 'bg-blue-primary/10 text-blue-primary' : 'text-text-primary'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedFolderId(folder.id)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFolder(folder.id);
            }}
            className="p-0.5 hover:bg-bg-secondary rounded"
          >
            {folder.children.length > 0 ? (
              folder.isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )
            ) : (
              <div className="size-4" />
            )}
          </button>

          {folder.isExpanded ? (
            <FolderOpen className="size-4 flex-shrink-0" />
          ) : (
            <Folder className="size-4 flex-shrink-0" />
          )}

          <span className="flex-1 text-sm truncate">{folder.name}</span>

          <span className="text-xs text-text-tertiary opacity-0 group-hover:opacity-100">
            {folder.note_count}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-bg-secondary rounded">
                <MoreVertical className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-bg-secondary border-border-primary">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedFolderId(folder.id);
                  setIsNewFolderDialogOpen(true);
                }}
                className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
              >
                <FolderPlus className="size-4 mr-2" />
                New Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setFolderToRename(folder);
                  setNewFolderName(folder.name);
                  setIsRenameFolderDialogOpen(true);
                }}
                className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
              >
                <Edit2 className="size-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border-primary" />
              <DropdownMenuItem
                onClick={() => {
                  setItemToDelete({ type: 'folder', id: folder.id });
                  setIsDeleteDialogOpen(true);
                }}
                className="text-red-500 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {folder.isExpanded && folder.children.length > 0 && (
          <>
            {folder.children.map((childFolder) => renderFolder(childFolder, level + 1))}
          </>
        )}
      </div>
    );
  };

  // Render move dialog folder list
  const renderMoveFolderList = (folders: FolderWithExpanded[], level: number = 0): JSX.Element[] => {
    return folders.flatMap(folder => [
      <button
        key={folder.id}
        onClick={() => handleMoveNote(folder.id)}
        className="w-full text-left px-3 py-2 hover:bg-bg-tertiary rounded-lg text-text-primary"
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        <Folder className="size-4 inline mr-2" />
        {folder.name}
      </button>,
      ...renderMoveFolderList(folder.children, level + 1),
    ]);
  };

  return (
    <div className="flex-1 flex bg-bg-primary h-full overflow-hidden relative">
      {/* Left Sidebar - Folder Tree */}
      {!isSidebarCollapsed && (
        <div className="w-64 border-r border-border-primary bg-bg-secondary flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border-primary">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg text-text-primary">MedNotes</h2>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="h-8 w-8 p-0 hover:bg-bg-tertiary text-text-secondary hover:text-text-primary"
                  title="Hide Sidebar"
                >
                  <PanelLeftClose className="size-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsNewFolderDialogOpen(true)}
                  className="bg-blue-primary hover:bg-blue-hover text-white h-7 px-2"
                >
                  <FolderPlus className="size-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 bg-bg-tertiary border-border-primary text-text-primary placeholder:text-text-tertiary text-sm"
              />
            </div>
          </div>

          {/* Folder Tree */}
          <ScrollArea className="flex-1">
            {loadingFolders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 text-blue-primary animate-spin" />
              </div>
            ) : (
              <div className="p-2 space-y-0.5">
                {/* All Notes option */}
                <div
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group hover:bg-bg-tertiary transition-colors ${
                    selectedFolderId === null ? 'bg-blue-primary/10 text-blue-primary' : 'text-text-primary'
                  }`}
                  onClick={() => setSelectedFolderId(null)}
                >
                  <div className="size-4" />
                  <FileText className="size-4 flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">All Notes</span>
                </div>

                {folderTree.map((folder) => renderFolder(folder))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Show Sidebar Button - When Collapsed */}
      {isSidebarCollapsed && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            size="sm"
            onClick={() => setIsSidebarCollapsed(false)}
            className="bg-bg-secondary hover:bg-bg-tertiary text-text-primary border border-border-primary h-9 w-9 p-0"
            title="Show Sidebar"
          >
            <PanelLeft className="size-4" />
          </Button>
        </div>
      )}

      {/* Middle Panel - Notes List */}
      <div className="w-80 border-r border-border-primary bg-bg-secondary flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-text-primary">
                {searchQuery
                  ? `Search Results (${notes.length})`
                  : selectedFolderId
                    ? folderTree.find(f => f.id === selectedFolderId)?.name || 'Notes'
                    : 'All Notes'}
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleCreateNote}
              className="bg-blue-primary hover:bg-blue-hover text-white h-8 px-3"
            >
              <Plus className="size-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1">
          {loadingNotes ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 text-blue-primary animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="size-12 mx-auto mb-3 text-text-tertiary" />
              <p className="text-sm text-text-secondary">
                {searchQuery ? 'No notes found' : 'No notes in this folder'}
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                {searchQuery ? 'Try a different search term' : 'Create your first note'}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => loadNote(note.id)}
                  className={`p-3 rounded-lg cursor-pointer group transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-primary/10 border border-blue-primary'
                      : 'bg-bg-tertiary hover:bg-bg-tertiary/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {note.is_pinned && <Pin className="size-3 text-yellow-500 flex-shrink-0" />}
                      <h4 className="text-sm text-text-primary truncate">
                        {note.title}
                      </h4>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-bg-secondary rounded">
                          <MoreHorizontal className="size-3.5 text-text-tertiary" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-bg-secondary border-border-primary">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(note.id);
                          }}
                          className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
                        >
                          <Pin className="size-4 mr-2" />
                          {note.is_pinned ? 'Unpin' : 'Pin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateNote(note);
                          }}
                          className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
                        >
                          <Copy className="size-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setNoteToMove(note);
                            setIsMoveDialogOpen(true);
                          }}
                          className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
                        >
                          <Move className="size-4 mr-2" />
                          Move to...
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveNote(note.id, !note.is_archived);
                          }}
                          className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
                        >
                          {note.is_archived ? (
                            <>
                              <ArchiveRestore className="size-4 mr-2" />
                              Restore
                            </>
                          ) : (
                            <>
                              <Archive className="size-4 mr-2" />
                              Archive
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border-primary" />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete({ type: 'note', id: note.id });
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-xs text-text-tertiary line-clamp-2 mb-2">
                    {note.excerpt || 'No content'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <span>
                      {note.updated_at
                        ? new Date(note.updated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : new Date(note.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                    </span>
                    {note.tags && note.tags.length > 0 && (
                      <span className="truncate ml-2">{note.tags[0]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Editor Panel */}
      <div className="flex-1 flex flex-col">
        {loadingNote ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="size-8 text-blue-primary animate-spin" />
          </div>
        ) : !selectedNote ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="size-16 mx-auto mb-4 text-text-tertiary" />
              <h3 className="text-xl text-text-primary mb-2">No Note Selected</h3>
              <p className="text-text-secondary mb-6">Select a note to start editing</p>
              <Button
                onClick={handleCreateNote}
                className="bg-blue-primary hover:bg-blue-hover text-white"
              >
                <Plus className="size-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Editor Header */}
            <div className="border-b border-border-primary bg-bg-secondary px-6 py-3">
              <div className="flex items-center justify-between mb-3">
                {isEditMode ? (
                  <Input
                    value={editingNoteTitle}
                    onChange={(e) => setEditingNoteTitle(e.target.value)}
                    className="text-xl border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-text-primary"
                    placeholder="Untitled Note"
                  />
                ) : (
                  <h1 className="text-xl text-text-primary">{selectedNote.title}</h1>
                )}
                <div className="flex items-center gap-2">
                  {!isEditMode ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => setIsEditMode(true)}
                        className="bg-blue-primary hover:bg-blue-hover text-white"
                      >
                        <Edit2 className="size-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          loadVersions(selectedNote.id);
                          setIsVersionHistoryOpen(true);
                        }}
                        className="border-border-primary text-text-secondary hover:bg-bg-tertiary"
                      >
                        <History className="size-4 mr-2" />
                        History
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditMode(false);
                          if (selectedNote) {
                            setEditingNoteTitle(selectedNote.title);
                            setEditorContent(selectedNote.content || '');
                          }
                        }}
                        className="border-border-primary text-text-secondary hover:bg-bg-tertiary"
                      >
                        <X className="size-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveNote}
                        disabled={savingNote}
                        className="bg-blue-primary hover:bg-blue-hover text-white"
                      >
                        {savingNote ? (
                          <Loader2 className="size-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="size-4 mr-2" />
                        )}
                        Save
                      </Button>
                      {lastSaved && (
                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                          <Save className="size-3" />
                          Saved {lastSaved.toLocaleTimeString()}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Rich Text Toolbar - Only show in edit mode */}
              {isEditMode && editor && (
                <div className="flex items-center gap-1 flex-wrap">
                  <div className="flex items-center gap-0.5 pr-2 border-r border-border-primary">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('bold') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Bold"
                    >
                      <Bold className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('italic') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Italic"
                    >
                      <Italic className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('underline') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Underline"
                    >
                      <Underline className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleHighlight().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('highlight') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Highlight"
                    >
                      <Highlighter className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-0.5 pr-2 border-r border-border-primary">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('heading', { level: 1 }) ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Heading 1"
                    >
                      <Heading1 className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('heading', { level: 2 }) ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Heading 2"
                    >
                      <Heading2 className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('heading', { level: 3 }) ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Heading 3"
                    >
                      <Heading3 className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-0.5 pr-2 border-r border-border-primary">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('bulletList') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Bullet List"
                    >
                      <List className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('orderedList') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Numbered List"
                    >
                      <ListOrdered className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleTaskList().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('taskList') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Checklist"
                    >
                      <CheckSquare className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                      className="h-8 w-8 p-0 hover:bg-bg-tertiary"
                      title="Insert Table"
                    >
                      <TableIcon className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                      className={`h-8 w-8 p-0 hover:bg-bg-tertiary ${
                        editor.isActive('codeBlock') ? 'bg-bg-tertiary' : ''
                      }`}
                      title="Code Block"
                    >
                      <Code className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) {
                          editor.chain().focus().setImage({ src: url }).run();
                        }
                      }}
                      className="h-8 w-8 p-0 hover:bg-bg-tertiary"
                      title="Insert Image"
                    >
                      <ImageIcon className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        toast.info('Attachment feature coming soon');
                      }}
                      className="h-8 w-8 p-0 hover:bg-bg-tertiary"
                      title="Attach File"
                    >
                      <Paperclip className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Editor Content */}
            <ScrollArea className="flex-1">
              <div className="max-w-4xl mx-auto p-8">
                <EditorContent
                  editor={editor}
                  className="prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] text-text-primary tiptap-editor"
                />
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      {/* Dialogs */}
      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Create New Folder</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Create a new folder {selectedFolderId ? 'as a subfolder' : 'at the root level'}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="bg-bg-tertiary border-border-primary text-text-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewFolderDialogOpen(false);
                setNewFolderName('');
              }}
              className="border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="bg-blue-primary hover:bg-blue-hover text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={isRenameFolderDialogOpen} onOpenChange={setIsRenameFolderDialogOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Rename Folder</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Enter a new name for "{folderToRename?.name}"
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="bg-bg-tertiary border-border-primary text-text-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameFolder();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRenameFolderDialogOpen(false);
                setFolderToRename(null);
                setNewFolderName('');
              }}
              className="border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameFolder}
              disabled={!newFolderName.trim()}
              className="bg-blue-primary hover:bg-blue-hover text-white"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
              className="border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Note Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Move Note</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Select a folder to move "{noteToMove?.title}" to
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-1">
            <button
              onClick={() => handleMoveNote(null)}
              className="w-full text-left px-3 py-2 hover:bg-bg-tertiary rounded-lg text-text-primary"
            >
              <FileText className="size-4 inline mr-2" />
              Root (No folder)
            </button>
            {renderMoveFolderList(folderTree)}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsMoveDialogOpen(false);
                setNoteToMove(null);
              }}
              className="border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={isVersionHistoryOpen} onOpenChange={setIsVersionHistoryOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Version History</DialogTitle>
            <DialogDescription className="text-text-secondary">
              View and restore previous versions of this note
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loadingVersions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 text-blue-primary animate-spin" />
              </div>
            ) : versions.length === 0 ? (
              <div className="p-4 text-center text-text-tertiary text-sm">
                No previous versions available
              </div>
            ) : (
              versions.map((version) => (
                <div
                  key={version.id}
                  className="p-4 bg-bg-tertiary rounded-lg border border-border-primary"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-primary">
                      Version {version.version_number}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {new Date(version.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">
                    {version.change_summary || `${version.word_count} words`}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreVersion(version.id)}
                    className="border-border-primary text-text-secondary hover:bg-bg-secondary"
                  >
                    Restore this version
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsVersionHistoryOpen(false)}
              className="bg-blue-primary hover:bg-blue-hover text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
