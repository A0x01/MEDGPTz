import { useState } from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Edit2, RotateCcw, Trash2, Eye, EyeOff } from 'lucide-react';
import { Flashcard } from '../types';
import { renderClozeText } from '../utils';

interface FlashcardItemProps {
  card: Flashcard;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onConvert: () => void;
  onDelete: () => void;
}

export function FlashcardItem({
  card,
  index,
  isSelected,
  onToggleSelect,
  onEdit,
  onConvert,
  onDelete,
}: FlashcardItemProps) {
  const [showClozePreview, setShowClozePreview] = useState(false);

  return (
    <Card
      className={`p-4 border transition-colors ${
        isSelected
          ? 'border-blue-primary bg-blue-primary/5'
          : 'border-border-primary bg-bg-secondary hover:border-blue-primary/30'
      }`}
    >
      <div className="flex gap-4">
        {/* Selection Checkbox */}
        <div className="flex items-start pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="size-5 rounded border-border-primary cursor-pointer"
          />
        </div>

        {/* Card Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                card.type === 'basic'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-purple-500/10 text-purple-400'
              }`}
            >
              {card.type === 'basic' ? 'Basic' : 'Cloze'}
            </span>
            <span className="text-xs text-text-tertiary">Card {index + 1}</span>
          </div>

          {card.type === 'basic' ? (
            <>
              <div className="mb-3">
                <div className="text-xs text-text-tertiary mb-1">Front</div>
                <div className="text-sm text-text-primary">{card.front}</div>
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Back</div>
                <div className="text-sm text-text-primary">{card.back}</div>
              </div>
            </>
          ) : (
            <div>
              <div className="text-xs text-text-tertiary mb-1 flex items-center gap-2">
                Cloze Text
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClozePreview(!showClozePreview)}
                  className="h-6 px-2 text-xs"
                >
                  {showClozePreview ? (
                    <>
                      <EyeOff className="size-3 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="size-3 mr-1" />
                      Preview
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-text-primary">
                {renderClozeText(card.text || '', showClozePreview)}
              </div>
            </div>
          )}

          {/* Tags */}
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs bg-bg-tertiary text-text-tertiary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
            title="Edit"
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onConvert}
            className="h-8 w-8 p-0"
            title="Convert Type"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
