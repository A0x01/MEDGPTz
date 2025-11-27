import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Star, 
  Clock, 
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Filter
} from 'lucide-react';
import { medicalTopics, flattenTopics, getBreadcrumbTrail } from '../../data/medquiz-topics';
import { Topic } from '../../types/medquiz';

interface TopicExplorerProps {
  onSelectTopic: (topicId: string) => void;
  onBack: () => void;
}

export function TopicExplorer({ onSelectTopic, onBack }: TopicExplorerProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(['medicine']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [favoriteTopics, setFavoriteTopics] = useState<Set<string>>(new Set(['cardiology', 'neurology']));

  const allTopics = useMemo(() => flattenTopics(medicalTopics), []);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return medicalTopics;
    
    const query = searchQuery.toLowerCase();
    const matchingTopics = allTopics.filter(topic => 
      topic.name.toLowerCase().includes(query)
    );
    
    // If we have matches, we need to show the full hierarchy
    if (matchingTopics.length > 0) {
      const relevantIds = new Set<string>();
      matchingTopics.forEach(topic => {
        const trail = getBreadcrumbTrail(topic.id);
        trail.forEach(t => relevantIds.add(t.id));
      });
      
      // Expand all relevant topics
      setExpandedTopics(relevantIds);
      
      return medicalTopics;
    }
    
    return medicalTopics;
  }, [searchQuery, allTopics]);

  const toggleExpand = (topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const toggleFavorite = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const renderTopic = (topic: Topic, depth: number = 0) => {
    const isExpanded = expandedTopics.has(topic.id);
    const hasChildren = topic.children && topic.children.length > 0;
    const isFavorite = favoriteTopics.has(topic.id);
    const isSelected = selectedTopicId === topic.id;
    const isMatch = searchQuery && topic.name.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <div key={topic.id}>
        <div
          className={`
            flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors
            ${isSelected ? 'bg-[var(--color-primary)]/10 border-l-2 border-[var(--color-primary)]' : ''}
            ${isMatch ? 'bg-[var(--color-warning)]/5' : ''}
            hover:bg-[var(--color-surface)]
          `}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(topic.id);
            }
            setSelectedTopicId(topic.id);
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(topic.id);
              }}
              className="w-4 h-4 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <BookOpen className="w-4 h-4 text-[var(--color-text-secondary)]" />
          
          <span className="flex-1 text-sm text-[var(--color-text)]">{topic.name}</span>
          
          <span className="text-xs text-[var(--color-text-secondary)]">{topic.questionCount}</span>
          
          <button
            onClick={(e) => toggleFavorite(topic.id, e)}
            className="w-4 h-4 flex items-center justify-center"
          >
            <Star 
              className={`w-4 h-4 ${isFavorite ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-text-secondary)]'}`}
            />
          </button>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {topic.children!.map(child => renderTopic(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedTopic = selectedTopicId ? allTopics.find(t => t.id === selectedTopicId) : null;
  const breadcrumbs = selectedTopicId ? getBreadcrumbTrail(selectedTopicId) : [];

  // Mock progress data
  const getTopicProgress = (topicId: string) => {
    const progresses: Record<string, { attempted: number; correct: number; lastAttempt: string }> = {
      'heart-failure': { attempted: 45, correct: 37, lastAttempt: '2 hours ago' },
      'cardiology': { attempted: 180, correct: 142, lastAttempt: '1 day ago' },
      'ischemic-stroke': { attempted: 38, correct: 29, lastAttempt: '3 days ago' },
    };
    return progresses[topicId] || null;
  };

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
          <div className="w-[260px] flex-shrink-0">
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

              {/* Favorites */}
              {favoriteTopics.size > 0 && !searchQuery && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-[var(--color-warning)]" />
                    <span className="text-sm font-medium text-[var(--color-text)]">Favorites</span>
                  </div>
                  <div className="space-y-1">
                    {Array.from(favoriteTopics).map(topicId => {
                      const topic = allTopics.find(t => t.id === topicId);
                      return topic ? (
                        <div
                          key={topicId}
                          onClick={() => {
                            setSelectedTopicId(topicId);
                            // Expand parent topics
                            const trail = getBreadcrumbTrail(topicId);
                            setExpandedTopics(new Set(trail.map(t => t.id)));
                          }}
                          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer py-1"
                        >
                          {topic.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Topic Tree */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredTopics.map(topic => renderTopic(topic))}
              </div>
            </div>
          </div>

          {/* Main Content - Topic Details */}
          <div className="flex-1">
            {selectedTopic ? (
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  {breadcrumbs.map((topic, index) => (
                    <React.Fragment key={topic.id}>
                      {index > 0 && <ChevronRight className="w-4 h-4" />}
                      <button
                        onClick={() => setSelectedTopicId(topic.id)}
                        className="hover:text-[var(--color-text)] transition-colors"
                      >
                        {topic.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Topic Header */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-[var(--color-text)] mb-2">{selectedTopic.name}</h2>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                        <span>{selectedTopic.questionCount} questions</span>
                        {selectedTopic.children && (
                          <span>{selectedTopic.children.length} subtopics</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(selectedTopic.id, e)}
                      className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                    >
                      <Star 
                        className={`w-5 h-5 ${favoriteTopics.has(selectedTopic.id) ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-text-secondary)]'}`}
                      />
                    </button>
                  </div>

                  {/* Progress */}
                  {(() => {
                    const progress = getTopicProgress(selectedTopic.id);
                    if (progress) {
                      const accuracy = Math.round((progress.correct / progress.attempted) * 100);
                      return (
                        <div className="mb-6">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-[var(--color-text-secondary)]">Your Progress</span>
                            <span className="text-[var(--color-text)]">{progress.attempted}/{selectedTopic.questionCount} attempted • {accuracy}% correct</span>
                          </div>
                          <div className="w-full h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--color-primary)]" 
                              style={{ width: `${(progress.attempted / selectedTopic.questionCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onSelectTopic(selectedTopic.id)}
                      className="py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Start Quiz
                    </button>
                    <button
                      onClick={() => onSelectTopic(selectedTopic.id)}
                      className="py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-background)] transition-colors"
                    >
                      Custom Quiz
                    </button>
                  </div>
                </div>

                {/* Subtopics */}
                {selectedTopic.children && selectedTopic.children.length > 0 && (
                  <div>
                    <h3 className="text-[var(--color-text)] mb-4">Subtopics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTopic.children.map(child => {
                        const progress = getTopicProgress(child.id);
                        const accuracy = progress ? Math.round((progress.correct / progress.attempted) * 100) : null;
                        
                        return (
                          <div
                            key={child.id}
                            onClick={() => setSelectedTopicId(child.id)}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-[var(--color-text)] font-medium mb-1">{child.name}</h4>
                                <div className="text-sm text-[var(--color-text-secondary)]">
                                  {child.questionCount} questions
                                </div>
                              </div>
                              {accuracy !== null && (
                                <div className="text-right">
                                  <div className="text-sm text-[var(--color-text-secondary)]">Accuracy</div>
                                  <div className={`font-medium ${accuracy >= 80 ? 'text-[var(--color-success)]' : accuracy >= 60 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}`}>
                                    {accuracy}%
                                  </div>
                                </div>
                              )}
                            </div>
                            {progress && (
                              <div className="w-full h-1.5 bg-[var(--color-background)] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[var(--color-primary)]"
                                  style={{ width: `${(progress.attempted / child.questionCount) * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

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
