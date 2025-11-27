import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Flashcard } from '../types';
import { FlashcardItem } from '../components/FlashcardItem';

interface ReviewCardsViewProps {
  cards: Flashcard[];
  selectedCards: Set<string>;
  onToggleCard: (cardId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCancel: () => void;
  onSave: () => void;
  onConvertCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export function ReviewCardsView({
  cards,
  selectedCards,
  onToggleCard,
  onSelectAll,
  onDeselectAll,
  onCancel,
  onSave,
  onConvertCard,
  onDeleteCard,
}: ReviewCardsViewProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg text-text-primary mb-1">Review Generated Cards</h2>
            <p className="text-sm text-text-secondary">
              {cards.length} cards generated • {selectedCards.size} selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="border-border-primary text-text-secondary hover:bg-bg-tertiary"
            >
              <X className="size-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={selectedCards.size === 0}
              className="bg-blue-primary hover:bg-blue-hover text-white"
            >
              <CheckCircle2 className="size-4 mr-2" />
              Add {selectedCards.size} Cards to Deck
            </Button>
          </div>
        </div>

        {/* Batch Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="border-border-primary text-text-primary hover:bg-bg-tertiary"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDeselectAll}
            className="border-border-primary text-text-primary hover:bg-bg-tertiary"
          >
            Deselect All
          </Button>
        </div>
      </div>

      {/* Cards List */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-3">
          {cards.map((card, index) => (
            <FlashcardItem
              key={card.id}
              card={card}
              index={index}
              isSelected={selectedCards.has(card.id)}
              onToggleSelect={() => onToggleCard(card.id)}
              onEdit={() => toast.info('Edit feature coming soon')}
              onConvert={() => onConvertCard(card.id)}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
