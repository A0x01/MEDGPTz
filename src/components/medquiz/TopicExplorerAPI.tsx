/**
 * TopicExplorer - API Integrated Version
 *
 * Fetches specialties and categories from the backend API.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Star,
  ArrowLeft,
  BookOpen,
  Loader2
} from 'lucide-react';
import { quizApi, statsApi } from '../../api';
import type { QuizSpecialty, QuizCategory, CategoryProgress } from '../../api/types';

interface TopicExplorerProps {
  onSelectTopic: (categoryId: number, specialtyId: number) => void;
  onBack: () => void;
}

interface SpecialtyWithCategories extends QuizSpecialty {
  categories: QuizCategory[];
  isLoading: boolean;
}

export function TopicExplorerAPI({ onSelectTopic, onBack }: TopicExplorerProps) {
  const [specialties, setSpecialties] = useState<SpecialtyWithCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<QuizSpecialty | null>(null);
  const [favoriteCategories, setFavoriteCategories] = useState<Set<number>>(new Set());
  const [categoryProgress, setCategoryProgress] = useState<Map<number, CategoryProgress>>(new Map());

  // Load specialties on mount
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setLoading(true);
        const response = await quizApi.getSpecialties({ active_only: true, page_size: 100 });
        setSpecialties(response.items.map(s => ({
          ...s,
          categories: [],
          isLoading: false,
        })));
        // Expand first specialty by default
        if (response.items.length > 0) {
          setExpandedSpecialties(new Set([response.items[0].id]));
          loadCategoriesForSpecialty(response.items[0].id);
        }
      } catch (err) {
        setError('Failed to load specialties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSpecialties();
  }, []);

  // Load categories for a specialty
  const loadCategoriesForSpecialty = useCallback(async (specialtyId: number) => {
    setSpecialties(prev => prev.map(s =>
      s.id === specialtyId ? { ...s, isLoading: true } : s
    ));

    try {
      const response = await quizApi.getCategories({
        specialty_id: specialtyId,
        active_only: true,
        page_size: 100
      });

      setSpecialties(prev => prev.map(s =>
        s.id === specialtyId ? { ...s, categories: response.items, isLoading: false } : s
      ));
    } catch (err) {
      console.error('Failed to load categories:', err);
      setSpecialties(prev => prev.map(s =>
        s.id === specialtyId ? { ...s, isLoading: false } : s
      ));
    }
  }, []);

  // Load progress for selected category
  useEffect(() => {
    if (selectedCategoryId && !categoryProgress.has(selectedCategoryId)) {
      const loadProgress = async () => {
        try {
          const progress = await quizApi.getCategoryProgress(selectedCategoryId);
          setCategoryProgress(prev => new Map(prev).set(selectedCategoryId, progress));
        } catch (err) {
          console.error('Failed to load progress:', err);
        }
      };
      loadProgress();
    }
  }, [selectedCategoryId, categoryProgress]);

  const toggleExpand = useCallback((specialtyId: number) => {
    setExpandedSpecialties(prev => {
      const next = new Set(prev);
      if (next.has(specialtyId)) {
        next.delete(specialtyId);
      } else {
        next.add(specialtyId);
        // Load categories if not already loaded
        const specialty = specialties.find(s => s.id === specialtyId);
        if (specialty && specialty.categories.length === 0) {
          loadCategoriesForSpecialty(specialtyId);
        }
      }
      return next;
    });
  }, [specialties, loadCategoriesForSpecialty]);

  const toggleFavorite = useCallback((categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // Filter specialties and categories based on search
  const filteredSpecialties = useMemo(() => {
    if (!searchQuery.trim()) return specialties;

    const query = searchQuery.toLowerCase();
    return specialties.map(specialty => {
      const matchingCategories = specialty.categories.filter(cat =>
        cat.name.toLowerCase().includes(query) ||
        cat.display_name.toLowerCase().includes(query)
      );

      const specialtyMatches = specialty.name.toLowerCase().includes(query) ||
        specialty.display_name.toLowerCase().includes(query);

      return {
        ...specialty,
        categories: specialtyMatches ? specialty.categories : matchingCategories,
        _matches: specialtyMatches || matchingCategories.length > 0,
      };
    }).filter(s => s._matches);
  }, [specialties, searchQuery]);

  // Get selected category details
  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    for (const specialty of specialties) {
      const category = specialty.categories.find(c => c.id === selectedCategoryId);
      if (category) {
        setSelectedSpecialty(specialty);
        return category;
      }
    }
    return null;
  }, [selectedCategoryId, specialties]);

  const progress = selectedCategoryId ? categoryProgress.get(selectedCategoryId) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-danger)] mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
            <div className="flex-1">
              <h1 className="text-[var(--color-text)]">Browse Topics</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Topic Tree */}
          <div className="w-[280px] flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Topic Tree */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {filteredSpecialties.map(specialty => {
                  const isExpanded = expandedSpecialties.has(specialty.id);

                  return (
                    <div key={specialty.id}>
                      {/* Specialty */}
                      <div
                        className="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-background)]"
                        onClick={() => toggleExpand(specialty.id)}
                      >
                        <button className="w-4 h-4 flex items-center justify-center text-[var(--color-text-secondary)]">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: specialty.color || '#3B82F6' }}
                        />

                        <span className="flex-1 text-sm font-medium text-[var(--color-text)]">
                          {specialty.display_name}
                        </span>

                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {specialty.question_count}
                        </span>
                      </div>

                      {/* Categories */}
                      {isExpanded && (
                        <div className="ml-4">
                          {specialty.isLoading ? (
                            <div className="flex items-center gap-2 py-2 px-3 text-sm text-[var(--color-text-secondary)]">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading...
                            </div>
                          ) : (
                            specialty.categories.map(category => {
                              const isSelected = selectedCategoryId === category.id;
                              const isFavorite = favoriteCategories.has(category.id);
                              const isMatch = searchQuery &&
                                (category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 category.display_name.toLowerCase().includes(searchQuery.toLowerCase()));

                              return (
                                <div
                                  key={category.id}
                                  className={`
                                    flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors
                                    ${isSelected ? 'bg-[var(--color-primary)]/10 border-l-2 border-[var(--color-primary)]' : ''}
                                    ${isMatch && !isSelected ? 'bg-[var(--color-warning)]/5' : ''}
                                    hover:bg-[var(--color-background)]
                                  `}
                                  onClick={() => setSelectedCategoryId(category.id)}
                                >
                                  <BookOpen className="w-4 h-4 text-[var(--color-text-secondary)]" />

                                  <span className="flex-1 text-sm text-[var(--color-text)]">
                                    {category.display_name}
                                  </span>

                                  <span className="text-xs text-[var(--color-text-secondary)]">
                                    {category.question_count}
                                  </span>

                                  <button
                                    onClick={(e) => toggleFavorite(category.id, e)}
                                    className="w-4 h-4 flex items-center justify-center"
                                  >
                                    <Star
                                      className={`w-4 h-4 ${isFavorite ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-text-secondary)]'}`}
                                    />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Topic Details */}
          <div className="flex-1">
            {selectedCategory ? (
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span>{selectedSpecialty?.display_name}</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-[var(--color-text)]">{selectedCategory.display_name}</span>
                </div>

                {/* Category Header */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-[var(--color-text)] mb-2">{selectedCategory.display_name}</h2>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                        <span>{selectedCategory.question_count} questions</span>
                        {selectedCategory.description && (
                          <span>{selectedCategory.description}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(selectedCategory.id, e)}
                      className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${favoriteCategories.has(selectedCategory.id) ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-text-secondary)]'}`}
                      />
                    </button>
                  </div>

                  {/* Progress */}
                  {progress && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[var(--color-text-secondary)]">Your Progress</span>
                        <span className="text-[var(--color-text)]">
                          {progress.attempted_questions}/{progress.total_questions} attempted
                          {progress.accuracy_percentage > 0 && ` • ${Math.round(progress.accuracy_percentage)}% correct`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-primary)]"
                          style={{ width: `${(progress.attempted_questions / progress.total_questions) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onSelectTopic(selectedCategory.id, selectedSpecialty!.id)}
                      className="py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Start Quiz
                    </button>
                    <button
                      onClick={() => onSelectTopic(selectedCategory.id, selectedSpecialty!.id)}
                      className="py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-background)] transition-colors"
                    >
                      Custom Quiz
                    </button>
                  </div>
                </div>

                {/* Study Tips */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                  <h3 className="text-[var(--color-text)] mb-4">Study Tips</h3>
                  <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5" />
                      <span>Start with easier questions to build confidence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5" />
                      <span>Review explanations carefully, even for correct answers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5" />
                      <span>Flag difficult questions for later review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5" />
                      <span>Create flashcards from missed questions</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4" />
                  <h3 className="text-[var(--color-text)] mb-2">Select a Topic</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Choose a topic from the sidebar to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
