import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  BookOpen,
  Upload,
  FileText,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Database,
  AlertCircle,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'configure' | 'knowledge' | 'review';

interface FormData {
  name: string;
  description: string;
  author: string;
  edition: string;
  category: string;
  files: File[];
  imagePreview: string | null;
  customInstructions: string;
  conversationStarters: string[];
}

export function AddContentDialog({ isOpen, onClose }: AddContentDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>('configure');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    author: '',
    edition: '',
    category: 'Internal Medicine',
    files: [],
    imagePreview: null,
    customInstructions: '',
    conversationStarters: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps: Step[] = ['configure', 'knowledge', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleClose = () => {
    setCurrentStep('configure');
    setFormData({
      name: '',
      description: '',
      author: '',
      edition: '',
      category: 'Internal Medicine',
      files: [],
      imagePreview: null,
      customInstructions: '',
      conversationStarters: [],
    });
    onClose();
  };

  const handleNext = () => {
    if (currentStep === 'configure') {
      if (!formData.name || !formData.author) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep('knowledge');
    } else if (currentStep === 'knowledge') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'knowledge') {
      setCurrentStep('configure');
    } else if (currentStep === 'review') {
      setCurrentStep('knowledge');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, files: [...formData.files, ...files] });
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    setFormData({ ...formData, files: newFiles });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagePreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imagePreview: null });
  };

  const handleConversationStarterChange = (index: number, value: string) => {
    const newStarters = [...formData.conversationStarters];
    newStarters[index] = value;
    setFormData({ ...formData, conversationStarters: newStarters });
  };

  const handleAddConversationStarter = () => {
    if (formData.conversationStarters.length < 4) {
      setFormData({ ...formData, conversationStarters: [...formData.conversationStarters, ''] });
    }
  };

  const handleRemoveConversationStarter = (index: number) => {
    const newStarters = formData.conversationStarters.filter((_, i) => i !== index);
    setFormData({ ...formData, conversationStarters: newStarters });
  };

  const handleCreate = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('Textbook added successfully! Vector indexing in progress...');
    setIsProcessing(false);
    handleClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[var(--bg-secondary)] border-[var(--border-primary)] p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-[var(--border-primary)] px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-primary)] text-2xl">Add New Content</DialogTitle>
            <DialogDescription className="text-[var(--text-secondary)]">
              Create a new medical textbook for students to chat with
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-6">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                      index <= currentStepIndex
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)] border border-[var(--border-primary)]'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-sm capitalize ${
                      index <= currentStepIndex
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-[2px] flex-1 mx-2 ${
                      index < currentStepIndex
                        ? 'bg-[#2563EB]'
                        : 'bg-[var(--border-primary)]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
          {currentStep === 'configure' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#1E40AF]/10 border border-[#93C5FD] dark:border-[#1E40AF] rounded-lg">
                <Sparkles className="size-5 text-[#2563EB] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#1E40AF] dark:text-[#93C5FD]">
                    Configure your medical textbook's basic information. This will help students find and identify the right resource.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Profile Image Upload */}
                <div>
                  <Label className="text-[var(--text-primary)]">Textbook Image</Label>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 mb-3">
                    Upload a cover image or icon for this textbook
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-full bg-[#2563EB]/10 border-2 border-dashed border-[var(--border-primary)] flex items-center justify-center overflow-hidden shrink-0">
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} alt="Textbook" className="size-full object-cover" />
                      ) : (
                        <BookOpen className="size-8 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload className="size-4 mr-2" />
                          {formData.imagePreview ? 'Change Image' : 'Upload Image'}
                        </Button>
                        {formData.imagePreview && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                          >
                            <X className="size-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <p className="text-xs text-[var(--text-tertiary)] mt-2">
                        Recommended: Square image, at least 400x400px
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="text-[var(--text-primary)]">
                    Textbook Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Step Up to Medicine"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-primary)]"
                  />
                </div>

                <div>
                  <Label htmlFor="author" className="text-[var(--text-primary)]">
                    Author(s) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="author"
                    placeholder="e.g., Mehta et al."
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edition" className="text-[var(--text-primary)]">
                      Edition
                    </Label>
                    <Input
                      id="edition"
                      placeholder="e.g., 4th Edition"
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                      className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-primary)]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-[var(--text-primary)]">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1.5 w-full h-9 px-3 rounded-md bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm"
                    >
                      <option>Internal Medicine</option>
                      <option>Surgery</option>
                      <option>Pediatrics</option>
                      <option>Obstetrics & Gynecology</option>
                      <option>Psychiatry</option>
                      <option>Pathology</option>
                      <option>Pharmacology</option>
                      <option>Emergency Medicine</option>
                      <option>Question Bank</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-[var(--text-primary)]">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the textbook and what topics it covers..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1.5 bg-[var(--bg-primary)] border-[var(--border-primary)] min-h-[100px]"
                  />
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Help students understand when to use this resource
                  </p>
                </div>

                {/* Conversation Starters */}
                <div>
                  <Label className="text-[var(--text-primary)]">Conversation Starters</Label>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 mb-3">
                    Add example prompts to help students start chatting (max 4)
                  </p>
                  <div className="space-y-2">
                    {formData.conversationStarters.map((starter, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`e.g., ${['Explain the pathophysiology of heart failure', 'What are the USMLE high-yield topics in cardiology?', 'Help me create a differential for chest pain', 'Quiz me on hypertension management'][index] || 'Enter a conversation starter...'}`}
                          value={starter}
                          onChange={(e) => handleConversationStarterChange(index, e.target.value)}
                          className="flex-1 bg-[var(--bg-primary)] border-[var(--border-primary)]"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveConversationStarter(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                    {formData.conversationStarters.length < 4 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddConversationStarter}
                        className="w-full"
                      >
                        <Plus className="size-4 mr-2" />
                        Add Conversation Starter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#1E40AF]/10 border border-[#93C5FD] dark:border-[#1E40AF] rounded-lg">
                <Database className="size-5 text-[#2563EB] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#1E40AF] dark:text-[#93C5FD]">
                    Upload PDF files to create a knowledge base. We'll process and index the content using vector embeddings for optimal AI responses.
                  </p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-[var(--border-primary)] rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                    <Upload className="size-8 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] mb-1">
                      Drop PDF files here or click to browse
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)]">
                      Maximum file size: 100MB per file
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="size-4 mr-2" />
                    Select Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {/* Uploaded Files */}
              {formData.files.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)]">
                    Uploaded Files ({formData.files.length})
                  </Label>
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]"
                    >
                      <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                        <FileText className="size-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text-primary)] truncate">{file.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="shrink-0"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Processing Options */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-primary)]">
                <Label className="text-[var(--text-primary)]">Custom Instructions</Label>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Define how the AI should behave when students chat with this textbook. These instructions will guide the chatbot's responses.
                </p>
                <Textarea
                  placeholder="Example: You are a medical tutor specializing in internal medicine. Always provide evidence-based explanations, cite specific pages from the textbook when possible, and use clinical reasoning frameworks like VINDICATE for differential diagnoses..."
                  className="bg-[var(--bg-primary)] border-[var(--border-primary)] min-h-[150px] text-sm"
                  value={formData.customInstructions}
                  onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                />
                <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <Sparkles className="size-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    <span className="font-medium">Pro tip:</span> Be specific about teaching style, clinical reasoning approach, and how to handle complex medical topics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] dark:from-[#14532D]/20 dark:to-[#166534]/10 border border-[#86EFAC] dark:border-[#166534] rounded-lg">
                <CheckCircle className="size-5 text-[#16A34A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#166534] dark:text-[#86EFAC]">
                    Review your textbook configuration before publishing. Students will be able to access this immediately after creation.
                  </p>
                </div>
              </div>

              {/* Preview Card */}
              <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] p-6">
                  <div className="flex items-start gap-4">
                    <div className="size-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden shrink-0">
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} alt="Textbook" className="size-full object-cover" />
                      ) : (
                        <BookOpen className="size-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl text-white mb-1">{formData.name || 'Untitled Textbook'}</h3>
                      <p className="text-sm text-blue-100">{formData.author || 'Unknown Author'}</p>
                      {formData.edition && (
                        <Badge className="mt-2 bg-white/20 text-white border-0">
                          {formData.edition}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 bg-[var(--bg-primary)]">
                  <div>
                    <Label className="text-[var(--text-secondary)] text-xs">Category</Label>
                    <p className="text-[var(--text-primary)] mt-1">{formData.category}</p>
                  </div>

                  {formData.description && (
                    <div>
                      <Label className="text-[var(--text-secondary)] text-xs">Description</Label>
                      <p className="text-[var(--text-primary)] mt-1 text-sm leading-relaxed">
                        {formData.description}
                      </p>
                    </div>
                  )}

                  {formData.conversationStarters.length > 0 && (
                    <div>
                      <Label className="text-[var(--text-secondary)] text-xs">Conversation Starters</Label>
                      <div className="mt-2 space-y-2">
                        {formData.conversationStarters.filter(s => s.trim()).map((starter, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-[var(--bg-secondary)] rounded-lg">
                            <MessageSquare className="size-4 text-[#2563EB] mt-0.5 shrink-0" />
                            <span className="text-sm text-[var(--text-primary)]">{starter}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-[var(--text-secondary)] text-xs">Knowledge Base</Label>
                    <div className="mt-2 space-y-2">
                      {formData.files.length > 0 ? (
                        <>
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-[var(--text-tertiary)]" />
                            <span className="text-sm text-[var(--text-primary)]">
                              {formData.files.length} PDF file{formData.files.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Database className="size-4 text-[var(--text-tertiary)]" />
                            <span className="text-sm text-[var(--text-primary)]">
                              Vector indexing will begin after creation
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-500">
                          <AlertCircle className="size-4" />
                          <span className="text-sm">No files uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.customInstructions && (
                    <div>
                      <Label className="text-[var(--text-secondary)] text-xs">Custom Instructions</Label>
                      <div className="mt-2 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
                        <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{formData.customInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] text-center">
                  <p className="text-2xl text-[#2563EB] mb-1">{formData.files.length}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Files</p>
                </div>
                <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] text-center">
                  <p className="text-2xl text-[#2563EB] mb-1">
                    {formData.files.reduce((acc, file) => acc + file.size, 0) > 0
                      ? formatFileSize(formData.files.reduce((acc, file) => acc + file.size, 0))
                      : '0 B'}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">Total Size</p>
                </div>
                <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] text-center">
                  <p className="text-2xl text-[#2563EB] mb-1">~2-5m</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Index Time</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-primary)] px-6 py-4 bg-[var(--bg-primary)]">
          <div className="flex items-center justify-between">
            <div>
              {currentStep !== 'configure' && (
                <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
                  <ChevronLeft className="size-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              {currentStep !== 'review' ? (
                <Button
                  className="bg-[#2563EB] hover:bg-[#3B82F6] text-white"
                  onClick={handleNext}
                  disabled={isProcessing}
                >
                  Continue
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                  onClick={handleCreate}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-4 mr-2" />
                      Create Textbook
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}