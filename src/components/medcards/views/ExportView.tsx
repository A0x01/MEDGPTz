import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card } from '../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { ArrowLeft, Download, Settings } from 'lucide-react';
import { Deck, ExportSettings } from '../types';

interface ExportViewProps {
  deck: Deck;
  exportSettings: ExportSettings;
  onBack: () => void;
  onSettingsChange: (settings: ExportSettings) => void;
  onExport: () => void;
}

export function ExportView({
  deck,
  exportSettings,
  onBack,
  onSettingsChange,
  onExport,
}: ExportViewProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-lg text-text-primary">Export to Anki</h2>
            <p className="text-xs text-text-secondary">
              Export "{deck.name}" as Anki package
            </p>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full space-y-6">
          <Card className="bg-bg-secondary border-border-primary p-6">
            <h3 className="text-text-primary mb-4 flex items-center gap-2">
              <Settings className="size-4" />
              Export Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Deck Name</label>
                <Input
                  value={deck.name}
                  readOnly
                  className="bg-bg-tertiary border-border-primary text-text-primary"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Card Types to Export</label>
                <Select
                  value={exportSettings.cardType}
                  onValueChange={(value) =>
                    onSettingsChange({ ...exportSettings, cardType: value as any })
                  }
                >
                  <SelectTrigger className="bg-bg-tertiary border-border-primary text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-secondary border-border-primary">
                    <SelectItem value="all">All card types</SelectItem>
                    <SelectItem value="basic">Basic cards only</SelectItem>
                    <SelectItem value="cloze">Cloze cards only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeScheduling}
                    onChange={(e) =>
                      onSettingsChange({ ...exportSettings, includeScheduling: e.target.checked })
                    }
                    className="size-4 rounded border-border-primary"
                  />
                  <span className="text-sm text-text-primary">Include scheduling data</span>
                </label>
                <p className="text-xs text-text-tertiary mt-1 ml-6">
                  Export review history and intervals (if available)
                </p>
              </div>
            </div>
          </Card>

          {/* Export Summary */}
          <Card className="bg-bg-secondary border-border-primary p-6">
            <h3 className="text-text-primary mb-3">Export Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Cards</span>
                <span className="text-text-primary">{deck.cardCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">File Format</span>
                <span className="text-text-primary">.apkg (Anki Package)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Estimated Size</span>
                <span className="text-text-primary">~2.3 MB</span>
              </div>
            </div>
          </Card>

          {/* Export Button */}
          <Button
            onClick={onExport}
            className="w-full bg-blue-primary hover:bg-blue-hover text-white h-12"
          >
            <Download className="size-5 mr-2" />
            Export to Anki
          </Button>
        </div>
      </div>
    </div>
  );
}
