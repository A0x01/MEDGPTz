/**
 * MedCards - API Integrated Version
 *
 * Flashcard management with FSRS spaced repetition algorithm.
 * Integrates with backend API for persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
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
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Folder,
  FolderOpen,
  Edit2,
  Trash2,
  Layers,
  BookOpen,
  GraduationCap,
  Clock,
  ArrowLeft,
  Check,
  X,
  RotateCcw,
  Brain,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  FileText,
} from 'lucide-react';
import { flashcardsApi } from '../api';
import type {
  FlashcardFolder,
  FlashcardDeckPreview,
  FlashcardDeck,
  Flashcard,
  StudySessionResponse,
  StudySessionCard,
  FlashcardState,
} from '../api/types';

// View modes for the component
type ViewMode = 'decks' | 'deck-detail' | 'study' | 'create-card' | 'edit-card';

// Extended folder type with expansion state
interface FolderWithExpanded extends FlashcardFolder {
  isExpanded: boolean;
  children: FolderWithExpanded[];
}

export function MedCardsAPI() {
  // Data state
  const [folders, setFolders] = useState<FolderWithExpanded[]>([]);
  const [decks, setDecks] = useState<FlashcardDeckPreview[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [deckCards, setDeckCards] = useState<Flashcard[]>([]);

  // Study session state
  const [studySession, setStudySession] = useState<StudySessionResponse | null>(null);
  const [currentCard, setCurrentCard] = useState<StudySessionCard | null>(null);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const cardStartTime = useState<number>(Date.now())[0];

  // Loading states
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('decks');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  // Dialog states
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isNewDeckDialogOpen, setIsNewDeckDialogOpen] = useState(false);
  const [isNewCardDialogOpen, setIsNewCardDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'deck' | 'card'; id: number } | null>(null);

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  // Load decks when folder changes
  useEffect(() => {
    loadDecks();
  }, [selectedFolderId]);

  // API Functions
  const loadFolders = async () => {
    setLoadingFolders(true);
    try {
      const response = await flashcardsApi.getFolders();
      // Build tree structure with expansion state
      const buildTree = (parentId: number | undefined): FolderWithExpanded[] => {
        return response.items
          .filter(f => f.parent_id === parentId)
          .map(f => ({
            ...f,
            isExpanded: expandedFolders.has(f.id),
            children: buildTree(f.id),
          }));
      };
      setFolders(buildTree(undefined));
    } catch (err) {
      console.error('Failed to load folders:', err);
      toast.error('Failed to load folders');
    } finally {
      setLoadingFolders(false);
    }
  };

  const loadDecks = async () => {
    setLoadingDecks(true);
    try {
      const response = await flashcardsApi.getDecks({
        folder_id: selectedFolderId ?? undefined,
      });
      setDecks(response.items);
    } catch (err) {
      console.error('Failed to load decks:', err);
      toast.error('Failed to load decks');
    } finally {
      setLoadingDecks(false);
    }
  };

  const loadDeck = async (deckId: number) => {
    setLoadingDeck(true);
    try {
      const [deck, cardsResponse] = await Promise.all([
        flashcardsApi.getDeck(deckId),
        flashcardsApi.getCards(deckId),
      ]);
      setSelectedDeck(deck);
      setDeckCards(cardsResponse.items);
      setViewMode('deck-detail');
    } catch (err) {
      console.error('Failed to load deck:', err);
      toast.error('Failed to load deck');
    } finally {
      setLoadingDeck(false);
    }
  };

  // Folder operations
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await flashcardsApi.createFolder({
        name: newFolderName,
        parent_id: selectedFolderId ?? undefined,
      });
      await loadFolders();
      setNewFolderName('');
      setIsNewFolderDialogOpen(false);
      toast.success(`Folder "${newFolderName}" created`);
    } catch (err) {
      console.error('Failed to create folder:', err);
      toast.error('Failed to create folder');
    }
  };

  const handleDeleteFolder = async () => {
    if (!itemToDelete || itemToDelete.type !== 'folder') return;

    try {
      await flashcardsApi.deleteFolder(itemToDelete.id);
      await loadFolders();
      if (selectedFolderId === itemToDelete.id) {
        setSelectedFolderId(null);
      }
      toast.success('Folder deleted');
    } catch (err) {
      console.error('Failed to delete folder:', err);
      toast.error('Failed to delete folder');
    } finally {
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

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
    setFolders(updateExpanded(folders));
  };

  // Deck operations
  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) return;

    try {
      const deck = await flashcardsApi.createDeck({
        name: newDeckName,
        description: newDeckDescription || undefined,
        folder_id: selectedFolderId ?? undefined,
      });
      await loadDecks();
      setNewDeckName('');
      setNewDeckDescription('');
      setIsNewDeckDialogOpen(false);
      toast.success(`Deck "${newDeckName}" created`);
    } catch (err) {
      console.error('Failed to create deck:', err);
      toast.error('Failed to create deck');
    }
  };

  const handleDeleteDeck = async () => {
    if (!itemToDelete || itemToDelete.type !== 'deck') return;

    try {
      await flashcardsApi.deleteDeck(itemToDelete.id);
      await loadDecks();
      if (selectedDeck?.id === itemToDelete.id) {
        setSelectedDeck(null);
        setViewMode('decks');
      }
      toast.success('Deck deleted');
    } catch (err) {
      console.error('Failed to delete deck:', err);
      toast.error('Failed to delete deck');
    } finally {
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Card operations
  const handleCreateCard = async () => {
    if (!selectedDeck || !newCardFront.trim() || !newCardBack.trim()) return;

    try {
      await flashcardsApi.createCard({
        deck_id: selectedDeck.id,
        front: newCardFront,
        back: newCardBack,
        card_type: 'basic',
      });
      const cardsResponse = await flashcardsApi.getCards(selectedDeck.id);
      setDeckCards(cardsResponse.items);
      setNewCardFront('');
      setNewCardBack('');
      setIsNewCardDialogOpen(false);
      toast.success('Card created');
    } catch (err) {
      console.error('Failed to create card:', err);
      toast.error('Failed to create card');
    }
  };

  const handleDeleteCard = async () => {
    if (!itemToDelete || itemToDelete.type !== 'card' || !selectedDeck) return;

    try {
      await flashcardsApi.deleteCard(itemToDelete.id);
      const cardsResponse = await flashcardsApi.getCards(selectedDeck.id);
      setDeckCards(cardsResponse.items);
      toast.success('Card deleted');
    } catch (err) {
      console.error('Failed to delete card:', err);
      toast.error('Failed to delete card');
    } finally {
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Study session operations
  const startStudySession = async () => {
    if (!selectedDeck) return;

    try {
      const session = await flashcardsApi.startStudySession({
        deck_id: selectedDeck.id,
        include_new: true,
        include_review: true,
        include_learning: true,
      });
      setStudySession(session);
      setCurrentCard(session.first_card ?? null);
      setIsShowingAnswer(false);
      setReviewedCount(0);
      setCorrectCount(0);
      setViewMode('study');
    } catch (err) {
      console.error('Failed to start study session:', err);
      toast.error('Failed to start study session');
    }
  };

  const submitReview = async (rating: 1 | 2 | 3 | 4) => {
    if (!currentCard || !studySession) return;

    setSubmittingReview(true);
    try {
      const result = await flashcardsApi.submitReview({
        card_id: currentCard.card.id,
        rating,
        time_spent_ms: Date.now() - cardStartTime,
      });

      setReviewedCount(prev => prev + 1);
      if (result.is_correct) {
        setCorrectCount(prev => prev + 1);
      }

      setIsShowingAnswer(false);

      // Check for more cards
      if (currentCard.position < currentCard.total_cards) {
        try {
          const nextSession = await flashcardsApi.startStudySession({
            deck_id: studySession.deck_id,
            max_cards: 1,
          });
          if (nextSession.first_card) {
            setCurrentCard({
              ...nextSession.first_card,
              position: currentCard.position + 1,
              total_cards: currentCard.total_cards,
            });
          } else {
            setCurrentCard(null);
          }
        } catch {
          setCurrentCard(null);
        }
      } else {
        setCurrentCard(null);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const endStudySession = () => {
    setStudySession(null);
    setCurrentCard(null);
    setViewMode('deck-detail');
    if (selectedDeck) {
      loadDeck(selectedDeck.id);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'folder') {
      await handleDeleteFolder();
    } else if (itemToDelete.type === 'deck') {
      await handleDeleteDeck();
    } else if (itemToDelete.type === 'card') {
      await handleDeleteCard();
    }
  };

  // Filter decks by search
  const filteredDecks = searchQuery
    ? decks.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : decks;

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
            {folder.deck_count}
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

  // Get state color
  const getStateColor = (state: FlashcardState) => {
    switch (state) {
      case 'new': return 'text-blue-500';
      case 'learning': return 'text-orange-500';
      case 'review': return 'text-green-500';
      case 'relearning': return 'text-red-500';
      default: return 'text-text-tertiary';
    }
  };

  return (
    <div className="flex-1 flex bg-bg-primary h-full overflow-hidden">
      {/* Study View */}
      {viewMode === 'study' && studySession && (
        <div className="flex-1 flex flex-col">
          {/* Study Header */}
          <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={endStudySession}
                className="text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="size-4 mr-2" />
                End Session
              </Button>
              <div className="text-center">
                <h2 className="text-lg text-text-primary">{studySession.deck_name}</h2>
                <p className="text-sm text-text-secondary">
                  {currentCard ? `${currentCard.position} / ${currentCard.total_cards}` : 'Complete!'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">
                  {reviewedCount > 0 && `${Math.round((correctCount / reviewedCount) * 100)}% correct`}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-primary transition-all duration-300"
                style={{
                  width: currentCard
                    ? `${(currentCard.position / currentCard.total_cards) * 100}%`
                    : '100%',
                }}
              />
            </div>
          </div>

          {/* Study Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            {currentCard ? (
              <div className="w-full max-w-2xl">
                {/* Card */}
                <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 min-h-[300px] flex flex-col">
                  {/* Front */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-text-tertiary mb-2">Question</p>
                      <p className="text-xl text-text-primary">{currentCard.card.front}</p>
                    </div>
                  </div>

                  {/* Answer section */}
                  {isShowingAnswer && (
                    <>
                      <div className="border-t border-border-primary my-6" />
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs text-text-tertiary mb-2">Answer</p>
                          <p className="text-xl text-text-primary">{currentCard.card.back}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6">
                  {!isShowingAnswer ? (
                    <Button
                      onClick={() => setIsShowingAnswer(true)}
                      className="w-full bg-blue-primary hover:bg-blue-hover text-white py-6 text-lg"
                    >
                      Show Answer
                    </Button>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      <Button
                        onClick={() => submitReview(1)}
                        disabled={submittingReview}
                        className="flex flex-col items-center py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                      >
                        <RotateCcw className="size-5 mb-1" />
                        <span className="text-sm">Again</span>
                        <span className="text-xs opacity-70">
                          {currentCard.schedule_preview.again_interval}
                        </span>
                      </Button>
                      <Button
                        onClick={() => submitReview(2)}
                        disabled={submittingReview}
                        className="flex flex-col items-center py-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20"
                      >
                        <ThumbsDown className="size-5 mb-1" />
                        <span className="text-sm">Hard</span>
                        <span className="text-xs opacity-70">
                          {currentCard.schedule_preview.hard_interval}
                        </span>
                      </Button>
                      <Button
                        onClick={() => submitReview(3)}
                        disabled={submittingReview}
                        className="flex flex-col items-center py-4 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20"
                      >
                        <ThumbsUp className="size-5 mb-1" />
                        <span className="text-sm">Good</span>
                        <span className="text-xs opacity-70">
                          {currentCard.schedule_preview.good_interval}
                        </span>
                      </Button>
                      <Button
                        onClick={() => submitReview(4)}
                        disabled={submittingReview}
                        className="flex flex-col items-center py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20"
                      >
                        <Zap className="size-5 mb-1" />
                        <span className="text-sm">Easy</span>
                        <span className="text-xs opacity-70">
                          {currentCard.schedule_preview.easy_interval}
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Session Complete */
              <div className="text-center">
                <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="size-10 text-green-500" />
                </div>
                <h2 className="text-2xl text-text-primary mb-2">Session Complete!</h2>
                <p className="text-text-secondary mb-6">
                  You reviewed {reviewedCount} cards with {Math.round((correctCount / reviewedCount) * 100)}% accuracy
                </p>
                <Button
                  onClick={endStudySession}
                  className="bg-blue-primary hover:bg-blue-hover text-white"
                >
                  Back to Deck
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deck Detail View */}
      {viewMode === 'deck-detail' && selectedDeck && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedDeck(null);
                  setViewMode('decks');
                }}
                className="text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Decks
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsNewCardDialogOpen(true)}
                  variant="outline"
                  className="border-border-primary text-text-primary hover:bg-bg-tertiary"
                >
                  <Plus className="size-4 mr-2" />
                  Add Card
                </Button>
                <Button
                  onClick={startStudySession}
                  disabled={selectedDeck.due_count === 0 && selectedDeck.new_count === 0}
                  className="bg-blue-primary hover:bg-blue-hover text-white"
                >
                  <GraduationCap className="size-4 mr-2" />
                  Study Now
                </Button>
              </div>
            </div>

            <h1 className="text-2xl text-text-primary mb-2">{selectedDeck.name}</h1>
            {selectedDeck.description && (
              <p className="text-text-secondary mb-4">{selectedDeck.description}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-bg-tertiary rounded-lg p-4 text-center">
                <p className="text-2xl text-text-primary">{selectedDeck.card_count}</p>
                <p className="text-xs text-text-tertiary">Total Cards</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl text-blue-500">{selectedDeck.new_count}</p>
                <p className="text-xs text-blue-500/70">New</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl text-orange-500">{selectedDeck.learning_count}</p>
                <p className="text-xs text-orange-500/70">Learning</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl text-green-500">{selectedDeck.due_count}</p>
                <p className="text-xs text-green-500/70">Due Today</p>
              </div>
            </div>
          </div>

          {/* Cards List */}
          <ScrollArea className="flex-1">
            {loadingDeck ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 text-blue-primary animate-spin" />
              </div>
            ) : deckCards.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="size-12 mx-auto mb-4 text-text-tertiary" />
                  <h3 className="text-lg text-text-primary mb-2">No cards yet</h3>
                  <p className="text-text-secondary mb-4">Add your first card to start studying</p>
                  <Button
                    onClick={() => setIsNewCardDialogOpen(true)}
                    className="bg-blue-primary hover:bg-blue-hover text-white"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Card
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {deckCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-bg-secondary border border-border-primary rounded-lg p-4 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-text-primary mb-2">{card.front}</p>
                        <p className="text-text-secondary text-sm">{card.back}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-bg-tertiary rounded">
                            <MoreVertical className="size-4 text-text-tertiary" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-bg-secondary border-border-primary">
                          <DropdownMenuItem
                            onClick={() => {
                              setItemToDelete({ type: 'card', id: card.id });
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
                    {card.tags && card.tags.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-bg-tertiary text-text-tertiary px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Deck List View */}
      {viewMode === 'decks' && (
        <>
          {/* Folder Sidebar */}
          <div className="w-64 border-r border-border-primary bg-bg-secondary flex flex-col h-full">
            <div className="p-4 border-b border-border-primary">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg text-text-primary">MedCards</h2>
                <Button
                  size="sm"
                  onClick={() => setIsNewFolderDialogOpen(true)}
                  className="bg-blue-primary hover:bg-blue-hover text-white h-7 px-2"
                >
                  <FolderPlus className="size-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {loadingFolders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 text-blue-primary animate-spin" />
                </div>
              ) : (
                <div className="p-2 space-y-0.5">
                  {/* All Decks option */}
                  <div
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group hover:bg-bg-tertiary transition-colors ${
                      selectedFolderId === null ? 'bg-blue-primary/10 text-blue-primary' : 'text-text-primary'
                    }`}
                    onClick={() => setSelectedFolderId(null)}
                  >
                    <div className="size-4" />
                    <Layers className="size-4 flex-shrink-0" />
                    <span className="flex-1 text-sm truncate">All Decks</span>
                  </div>

                  {folders.map((folder) => renderFolder(folder))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl text-text-primary mb-1">
                    {selectedFolderId
                      ? folders.find(f => f.id === selectedFolderId)?.name || 'Folder'
                      : 'All Decks'}
                  </h1>
                  <p className="text-sm text-text-secondary">
                    {filteredDecks.length} deck{filteredDecks.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  onClick={() => setIsNewDeckDialogOpen(true)}
                  className="bg-blue-primary hover:bg-blue-hover text-white"
                >
                  <Plus className="size-4 mr-2" />
                  New Deck
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
                <Input
                  placeholder="Search decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-bg-tertiary border-border-primary text-text-primary"
                />
              </div>
            </div>

            {/* Decks Grid */}
            <ScrollArea className="flex-1">
              {loadingDecks ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-8 text-blue-primary animate-spin" />
                </div>
              ) : filteredDecks.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Layers className="size-12 mx-auto mb-4 text-text-tertiary" />
                    <h3 className="text-lg text-text-primary mb-2">
                      {searchQuery ? 'No decks found' : 'No decks yet'}
                    </h3>
                    <p className="text-text-secondary mb-4">
                      {searchQuery ? 'Try a different search term' : 'Create your first deck to start'}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => setIsNewDeckDialogOpen(true)}
                        className="bg-blue-primary hover:bg-blue-hover text-white"
                      >
                        <Plus className="size-4 mr-2" />
                        Create Deck
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDecks.map((deck) => (
                    <div
                      key={deck.id}
                      onClick={() => loadDeck(deck.id)}
                      className="bg-bg-secondary border border-border-primary rounded-lg p-4 cursor-pointer hover:border-blue-primary/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="size-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: deck.color ? `${deck.color}20` : 'var(--color-bg-tertiary)' }}
                        >
                          <BookOpen
                            className="size-5"
                            style={{ color: deck.color || 'var(--color-text-secondary)' }}
                          />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-bg-tertiary rounded">
                              <MoreVertical className="size-4 text-text-tertiary" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-bg-secondary border-border-primary">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete({ type: 'deck', id: deck.id });
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

                      <h3 className="text-text-primary mb-1">{deck.name}</h3>
                      {deck.description && (
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">{deck.description}</p>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-tertiary">{deck.card_count} cards</span>
                        <div className="flex items-center gap-2">
                          {deck.new_count > 0 && (
                            <span className="text-blue-500">{deck.new_count} new</span>
                          )}
                          {deck.due_count > 0 && (
                            <span className="text-green-500">{deck.due_count} due</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}

      {/* Dialogs */}
      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Create New Folder</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Create a folder to organize your decks
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="bg-bg-tertiary border-border-primary text-text-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
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

      {/* New Deck Dialog */}
      <Dialog open={isNewDeckDialogOpen} onOpenChange={setIsNewDeckDialogOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Create New Deck</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Create a new flashcard deck
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Deck name"
              className="bg-bg-tertiary border-border-primary text-text-primary"
            />
            <Input
              value={newDeckDescription}
              onChange={(e) => setNewDeckDescription(e.target.value)}
              placeholder="Description (optional)"
              className="bg-bg-tertiary border-border-primary text-text-primary"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewDeckDialogOpen(false);
                setNewDeckName('');
                setNewDeckDescription('');
              }}
              className="border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDeck}
              disabled={!newDeckName.trim()}
              className="bg-blue-primary hover:bg-blue-hover text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Card Dialog */}
      <Dialog open={isNewCardDialogOpen} onOpenChange={setIsNewCardDialogOpen}>
        <DialogContent className="bg-bg-secondary border-border-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Add New Card</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Create a new flashcard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Front (Question)</label>
              <Input
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                placeholder="Enter the question"
                className="bg-bg-tertiary border-border-primary text-text-primary"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Back (Answer)</label>
              <Input
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                placeholder="Enter the answer"
                className="bg-bg-tertiary border-border-primary text-text-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewCardDialogOpen(false);
                setNewCardFront('');
                setNewCardBack('');
              }}
              className="border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCard}
              disabled={!newCardFront.trim() || !newCardBack.trim()}
              className="bg-blue-primary hover:bg-blue-hover text-white"
            >
              Add Card
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
    </div>
  );
}
