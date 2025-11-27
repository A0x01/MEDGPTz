import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
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
  Clock,
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

// Types
interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children: string[];
  notes: string[];
  isExpanded: boolean;
  createdAt: Date;
}

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  versions: NoteVersion[];
}

interface NoteVersion {
  id: string;
  content: string;
  timestamp: Date;
}

// Sample data
const initialFolders: Folder[] = [
  {
    id: 'root',
    name: 'All Notes',
    parentId: null,
    children: ['cardio', 'pulm', 'endo'],
    notes: [],
    isExpanded: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'cardio',
    name: 'Cardiology',
    parentId: 'root',
    children: ['cardio-acs', 'cardio-hf'],
    notes: ['note1'],
    isExpanded: true,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'cardio-acs',
    name: 'Acute Coronary Syndrome',
    parentId: 'cardio',
    children: [],
    notes: ['note2'],
    isExpanded: false,
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 'cardio-hf',
    name: 'Heart Failure',
    parentId: 'cardio',
    children: [],
    notes: [],
    isExpanded: false,
    createdAt: new Date('2024-01-04'),
  },
  {
    id: 'pulm',
    name: 'Pulmonology',
    parentId: 'root',
    children: ['pulm-asthma'],
    notes: ['note3'],
    isExpanded: false,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'pulm-asthma',
    name: 'Asthma & COPD',
    parentId: 'pulm',
    children: [],
    notes: [],
    isExpanded: false,
    createdAt: new Date('2024-01-06'),
  },
  {
    id: 'endo',
    name: 'Endocrinology',
    parentId: 'root',
    children: [],
    notes: [],
    isExpanded: false,
    createdAt: new Date('2024-01-07'),
  },
];

const initialNotes: Note[] = [
  {
    id: 'note1',
    title: 'Beta Blockers in ACS',
    content: `<h1>Beta Blockers in Acute Coronary Syndrome</h1>

<h2>Mechanism of Action</h2>
<p>Beta-adrenergic receptor antagonists reduce myocardial oxygen demand by:</p>
<ul>
  <li>Decreasing heart rate</li>
  <li>Reducing contractility</li>
  <li>Lowering blood pressure</li>
</ul>

<h2>Indications</h2>
<p><strong>Primary indications:</strong></p>
<ul class="checklist">
  <li>STEMI without contraindications</li>
  <li>NSTEMI with ongoing ischemia</li>
  <li>Post-MI secondary prevention</li>
</ul>

<h2>Contraindications</h2>
<div class="highlight-box">
  <p><strong>Absolute contraindications:</strong></p>
  <ul>
    <li>Cardiogenic shock</li>
    <li>Decompensated heart failure</li>
    <li>High-degree AV block</li>
    <li>Severe bradycardia (HR <50 bpm)</li>
  </ul>
</div>

<h2>Dosing</h2>
<table>
  <tr>
    <th>Agent</th>
    <th>Initial Dose</th>
    <th>Target Dose</th>
  </tr>
  <tr>
    <td>Metoprolol</td>
    <td>25 mg BID</td>
    <td>200 mg/day</td>
  </tr>
  <tr>
    <td>Carvedilol</td>
    <td>3.125 mg BID</td>
    <td>25 mg BID</td>
  </tr>
  <tr>
    <td>Bisoprolol</td>
    <td>1.25 mg daily</td>
    <td>10 mg daily</td>
  </tr>
</table>

<h3>Clinical Pearl</h3>
<p><mark>Start beta blockers within 24 hours of admission for maximum mortality benefit</mark></p>`,
    folderId: 'cardio',
    tags: ['ACS', 'Pharmacology', 'Cardiology'],
    category: 'Cardiology',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    versions: [],
  },
  {
    id: 'note2',
    title: 'STEMI Management Protocol',
    content: `<h1>STEMI Management Protocol</h1>

<h2>Initial Assessment (0-10 minutes)</h2>
<ul class="checklist">
  <li>12-lead ECG within 10 minutes</li>
  <li>IV access x2</li>
  <li>Oxygen if SpO2 <90%</li>
  <li>Aspirin 325mg chewed</li>
  <li>Nitroglycerin SL if BP permits</li>
</ul>

<h2>Reperfusion Strategy</h2>
<p><strong>Primary PCI</strong> (preferred if available within 90 minutes)</p>
<ul>
  <li>Loading dose P2Y12 inhibitor</li>
  <li>Anticoagulation (heparin or bivalirudin)</li>
  <li>Consider GPI if large thrombus burden</li>
</ul>

<p><strong>Fibrinolysis</strong> (if PCI not available within 120 minutes)</p>
<div class="code-block">
Fibrinolytic agents:
- Alteplase (tPA): 15 mg bolus → 0.75 mg/kg over 30 min → 0.5 mg/kg over 60 min
- Reteplase: 10 U bolus x2, 30 minutes apart
- Tenecteplase: Weight-based single bolus
</div>

<h2>Post-PCI Care</h2>
<table>
  <tr>
    <th>Medication</th>
    <th>Timing</th>
    <th>Duration</th>
  </tr>
  <tr>
    <td>DAPT</td>
    <td>Immediately</td>
    <td>12 months minimum</td>
  </tr>
  <tr>
    <td>Beta-blocker</td>
    <td>Within 24 hours</td>
    <td>Lifelong</td>
  </tr>
  <tr>
    <td>ACE-I/ARB</td>
    <td>Within 24 hours</td>
    <td>Lifelong</td>
  </tr>
  <tr>
    <td>High-intensity statin</td>
    <td>Immediately</td>
    <td>Lifelong</td>
  </tr>
</table>`,
    folderId: 'cardio-acs',
    tags: ['STEMI', 'Emergency', 'Protocol'],
    category: 'Cardiology',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    versions: [],
  },
  {
    id: 'note3',
    title: 'Asthma Exacerbation Management',
    content: `<h1>Asthma Exacerbation Management</h1>

<h2>Severity Assessment</h2>
<p><strong>Mild-Moderate:</strong></p>
<ul>
  <li>Speaks in phrases</li>
  <li>SpO2 >90%</li>
  <li>PEFR 40-69% predicted</li>
</ul>

<p><strong>Severe:</strong></p>
<ul>
  <li>Speaks in words</li>
  <li>SpO2 <90%</li>
  <li>PEFR <40% predicted</li>
  <li>Silent chest, cyanosis, altered mental status</li>
</ul>

<h2>Treatment Protocol</h2>
<div class="highlight-box">
  <p><strong>First-line therapy:</strong></p>
  <ul class="checklist">
    <li>Oxygen to maintain SpO2 >90%</li>
    <li>Albuterol 2.5-5mg nebulized q20min x3</li>
    <li>Ipratropium 0.5mg nebulized q20min x3</li>
    <li>Systemic corticosteroids (prednisone 40-60mg or methylprednisolone 125mg IV)</li>
  </ul>
</div>

<h2>Refractory Cases</h2>
<p>If inadequate response after 1 hour:</p>
<ul>
  <li><mark>Magnesium sulfate 2g IV over 20 minutes</mark></li>
  <li>Consider continuous albuterol nebulization</li>
  <li>ICU admission if impending respiratory failure</li>
  <li>Heliox for severe upper airway obstruction</li>
</ul>

<h2>Discharge Criteria</h2>
<ul class="checklist">
  <li>PEFR >70% predicted or personal best</li>
  <li>SpO2 >90% on room air</li>
  <li>Symptom-free or minimal symptoms</li>
  <li>No accessory muscle use</li>
</ul>`,
    folderId: 'pulm',
    tags: ['Asthma', 'Emergency', 'Protocol'],
    category: 'Pulmonology',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    versions: [],
  },
];

export function MedNotes() {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('root');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isRenameFolderDialogOpen, setIsRenameFolderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderToRename, setFolderToRename] = useState<Folder | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'note'; id: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingNoteTitle, setEditingNoteTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const editorInitialized = useRef(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Memoize extensions array to prevent recreation
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        // Configure StarterKit to avoid conflicts
      }),
      Highlight,
      UnderlineExtension,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
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
    [] // Empty dependency array - only create once
  );

  // Update editor content when note changes
  useEffect(() => {
    if (editor && selectedNote) {
      editor.commands.setContent(selectedNote.content);
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
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorContent, selectedNote, isEditMode]);

  const handleAutoSave = () => {
    if (!selectedNote) return;

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: editingNoteTitle,
              content: editorContent,
              updatedAt: new Date(),
            }
          : note
      )
    );

    setLastSaved(new Date());
  };

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, isExpanded: !folder.isExpanded } : folder
      )
    );
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim() || !selectedFolderId) return;

    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      parentId: selectedFolderId,
      children: [],
      notes: [],
      isExpanded: false,
      createdAt: new Date(),
    };

    setFolders((prev) => [
      ...prev,
      newFolder,
      ...prev.map((f) =>
        f.id === selectedFolderId ? { ...f, children: [...f.children, newFolder.id] } : f
      ).slice(1),
    ]);

    setNewFolderName('');
    setIsNewFolderDialogOpen(false);
    toast.success(`Folder "${newFolderName}" created`);
  };

  // Rename folder
  const handleRenameFolder = () => {
    if (!folderToRename || !newFolderName.trim()) return;

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderToRename.id ? { ...folder, name: newFolderName } : folder
      )
    );

    setFolderToRename(null);
    setNewFolderName('');
    setIsRenameFolderDialogOpen(false);
    toast.success('Folder renamed');
  };

  // Delete folder or note
  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'folder') {
      const folderToDelete = folders.find((f) => f.id === itemToDelete.id);
      if (folderToDelete) {
        // Remove folder from parent's children
        setFolders((prev) =>
          prev
            .filter((f) => f.id !== itemToDelete.id)
            .map((f) => ({
              ...f,
              children: f.children.filter((childId) => childId !== itemToDelete.id),
            }))
        );
        toast.success(`Folder "${folderToDelete.name}" deleted`);
      }
    } else {
      const noteToDelete = notes.find((n) => n.id === itemToDelete.id);
      if (noteToDelete) {
        setNotes((prev) => prev.filter((n) => n.id !== itemToDelete.id));
        if (selectedNote?.id === itemToDelete.id) {
          setSelectedNote(null);
        }
        toast.success(`Note "${noteToDelete.title}" deleted`);
      }
    }

    setItemToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // Create new note
  const handleCreateNote = () => {
    if (!selectedFolderId) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '<h1>New Note</h1><p>Start typing...</p>',
      folderId: selectedFolderId,
      tags: [],
      category: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [],
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
    setEditingNoteTitle(newNote.title);
    setEditorContent(newNote.content);
    setIsEditMode(true);
    setIsCreatingNote(false);
    toast.success('New note created');
  };

  // Rich text editor functions
  const applyFormat = (format: string, value?: string) => {
    document.execCommand(format, false, value);
  };

  // Render folder tree
  const renderFolder = (folder: Folder, level: number = 0) => {
    const childFolders = folders.filter((f) => f.parentId === folder.id);
    const folderNotes = notes.filter((n) => n.folderId === folder.id);
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
            {childFolders.length > 0 ? (
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
            {folderNotes.length}
          </span>

          {folder.id !== 'root' && (
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
          )}
        </div>

        {folder.isExpanded && (
          <>
            {childFolders.map((childFolder) => renderFolder(childFolder, level + 1))}
          </>
        )}
      </div>
    );
  };

  // Filter notes and folders
  const getFilteredContent = () => {
    if (!searchQuery.trim()) {
      return notes.filter((n) => n.folderId === selectedFolderId);
    }

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredNotes = getFilteredContent();

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
            <div className="p-2 space-y-0.5">
              {folders
                .filter((f) => f.parentId === null)
                .map((folder) => renderFolder(folder))}
            </div>
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
                  ? `Search Results (${filteredNotes.length})`
                  : folders.find((f) => f.id === selectedFolderId)?.name || 'Notes'}
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleCreateNote}
              disabled={!selectedFolderId}
              className="bg-blue-primary hover:bg-blue-hover text-white h-8 px-3"
            >
              <Plus className="size-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1">
          {filteredNotes.length === 0 ? (
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
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setEditingNoteTitle(note.title);
                    setEditorContent(note.content);
                    setIsEditMode(false);
                  }}
                  className={`p-3 rounded-lg cursor-pointer group transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-primary/10 border border-blue-primary'
                      : 'bg-bg-tertiary hover:bg-bg-tertiary/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm text-text-primary truncate flex-1 pr-2">
                      {note.title}
                    </h4>
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
                            // Duplicate note logic
                            toast.success('Note duplicated');
                          }}
                          className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
                        >
                          <Copy className="size-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Move note logic
                            toast.info('Move feature coming soon');
                          }}
                          className="text-text-primary hover:bg-bg-tertiary cursor-pointer"
                        >
                          <Move className="size-4 mr-2" />
                          Move to...
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
                    {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <span>
                      {new Date(note.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {note.tags.length > 0 && (
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
        {!selectedNote ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="size-16 mx-auto mb-4 text-text-tertiary" />
              <h3 className="text-xl text-text-primary mb-2">No Note Selected</h3>
              <p className="text-text-secondary mb-6">Select a note to start editing</p>
              <Button
                onClick={handleCreateNote}
                disabled={!selectedFolderId}
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
                        onClick={() => setIsVersionHistoryOpen(true)}
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
                          // Revert changes
                          if (selectedNote) {
                            setEditingNoteTitle(selectedNote.title);
                            setEditorContent(selectedNote.content);
                          }
                        }}
                        className="border-border-primary text-text-secondary hover:bg-bg-tertiary"
                      >
                        <X className="size-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          handleAutoSave();
                          setIsEditMode(false);
                          toast.success('Note saved');
                        }}
                        className="bg-blue-primary hover:bg-blue-hover text-white"
                      >
                        <Save className="size-4 mr-2" />
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
              Create a new folder in{' '}
              {folders.find((f) => f.id === selectedFolderId)?.name || 'this location'}
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
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border-primary">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-primary">Current Version</span>
                <span className="text-xs text-text-tertiary">
                  {selectedNote?.updatedAt.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-text-secondary">This is the current version</p>
            </div>
            <div className="p-4 text-center text-text-tertiary text-sm">
              No previous versions available
            </div>
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