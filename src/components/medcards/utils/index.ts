// Render cloze text with preview
export const renderClozeText = (text: string, showAnswers: boolean): string => {
  if (!text) return '';
  
  // Simple cloze rendering
  if (showAnswers) {
    return text.replace(/{{c\d+::/g, '[').replace(/}}/g, ']');
  } else {
    return text.replace(/{{c\d+::(.*?)}}/g, '[...]');
  }
};

// Generate mock flashcards
export const generateMockFlashcards = (
  deckId: string,
  fileName: string,
  count: number = 5
) => {
  const templates = [
    {
      type: 'basic' as const,
      front: 'What is the mechanism of action of ACE inhibitors?',
      back: 'ACE inhibitors block the conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion.',
      tags: ['Pharmacology', 'Cardiology'],
    },
    {
      type: 'cloze' as const,
      text: 'ACE inhibitors block the conversion of {{c1::angiotensin I}} to {{c2::angiotensin II}}, reducing vasoconstriction.',
      tags: ['Pharmacology'],
    },
    {
      type: 'basic' as const,
      front: 'What are common side effects of ACE inhibitors?',
      back: 'Dry cough (due to bradykinin accumulation), hyperkalemia, angioedema (rare but serious), hypotension.',
      tags: ['Pharmacology', 'Side Effects'],
    },
    {
      type: 'cloze' as const,
      text: 'The most common side effect of ACE inhibitors is {{c1::dry cough}}, caused by {{c2::bradykinin}} accumulation.',
      tags: ['Pharmacology'],
    },
    {
      type: 'basic' as const,
      front: 'What are contraindications for ACE inhibitors?',
      back: 'Pregnancy (teratogenic), bilateral renal artery stenosis, history of angioedema, hyperkalemia.',
      tags: ['Pharmacology', 'Contraindications'],
    },
  ];

  return templates.slice(0, count).map((template, index) => ({
    id: `gen-${Date.now()}-${index}`,
    ...template,
    deckId,
    source: 'auto' as const,
    sourceFile: fileName,
    createdAt: new Date(),
    reviewCount: 0,
  }));
};
