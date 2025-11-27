import { useRef } from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { ArrowLeft, Upload, FileUp, FileText, X, Settings, Sparkles } from 'lucide-react';
import { Deck } from '../types';

interface UploadViewProps {
  selectedDeck: Deck;
  uploadedFile: File | null;
  isDragging: boolean;
  onBack: () => void;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onGenerate: () => void;
}

export function UploadView({
  selectedDeck,
  uploadedFile,
  isDragging,
  onBack,
  onFileSelect,
  onFileRemove,
  onDragOver,
  onDragLeave,
  onDrop,
  onGenerate,
}: UploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            <h2 className="text-lg text-text-primary">
              Generate Flashcards for "{selectedDeck.name}"
            </h2>
            <p className="text-xs text-text-secondary">
              Upload a PDF to automatically generate flashcards
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {!uploadedFile ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging
                  ? 'border-blue-primary bg-blue-primary/5'
                  : 'border-border-primary hover:border-blue-primary/50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="size-16 rounded-full bg-blue-primary/10 flex items-center justify-center mb-4">
                  <FileUp className="size-8 text-blue-primary" />
                </div>
                <h3 className="text-xl text-text-primary mb-2">Upload PDF Document</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileSelect(file);
                  }}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-primary hover:bg-blue-hover text-white"
                >
                  <Upload className="size-4 mr-2" />
                  Select PDF File
                </Button>
                <p className="text-xs text-text-tertiary mt-4">
                  Supported: Lecture slides, study guides, medical notes
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <Card className="bg-bg-secondary border-border-primary p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="size-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text-primary mb-1 truncate">{uploadedFile.name}</h3>
                    <p className="text-sm text-text-tertiary">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFileRemove}
                    className="text-text-tertiary hover:text-text-primary"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </Card>

              {/* Generation Settings */}
              <Card className="bg-bg-secondary border-border-primary p-6">
                <h3 className="text-text-primary mb-4 flex items-center gap-2">
                  <Settings className="size-4" />
                  Generation Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-text-secondary mb-2 block">Card Types</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="size-4 rounded border-border-primary"
                        />
                        <span className="text-sm text-text-primary">Basic Cards</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="size-4 rounded border-border-primary"
                        />
                        <span className="text-sm text-text-primary">Cloze Deletions</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-2 block">Focus Areas</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-bg-tertiary border-border-primary text-text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-secondary border-border-primary">
                        <SelectItem value="all">All content</SelectItem>
                        <SelectItem value="definitions">Definitions only</SelectItem>
                        <SelectItem value="mechanisms">Mechanisms of action</SelectItem>
                        <SelectItem value="clinical">Clinical applications</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={onGenerate}
                className="w-full bg-blue-primary hover:bg-blue-hover text-white h-12"
              >
                <Sparkles className="size-5 mr-2" />
                Generate Flashcards with AI
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
