'use client';

import { Word } from '@/app/page';
import { useTheme } from '@/contexts/ThemeContext';

interface WordsTableProps {
  words: Word[];
  onDeleteWord: (german: string) => void;
  onWordClick?: (word: Word) => void;
}

function getWordTypeClass(partOfSpeech: string, theme: any): string {
  switch (partOfSpeech.toLowerCase()) {
    case 'noun':
      return theme.wordTypes.noun;
    case 'verb':
      return theme.wordTypes.verb;
    case 'adjective':
      return theme.wordTypes.adjective;
    case 'adverb':
      return theme.wordTypes.adverb;
    default:
      return theme.wordTypes.other;
  }
}

export default function WordsTable({ words, onDeleteWord, onWordClick }: WordsTableProps) {
  const { theme } = useTheme();
  
  if (words.length === 0) {
    return (
      <div className={`${theme.glass} rounded-2xl overflow-hidden`}>
        <div className="text-center py-16 px-6">
          <svg 
            className={`mx-auto h-16 w-16 ${theme.text.secondary} mb-4`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
          <h3 className={`text-lg font-medium ${theme.text.primary} mb-2`}>No words found</h3>
          <p className={theme.text.secondary}>Try adjusting your filters or adding a new word to get started.</p>
        </div>
      </div>
    );
  }

  // Words are already sorted in the parent component
  const sortedWords = words;

  return (
    <div className={`${theme.glass} rounded-xl overflow-hidden`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
        {sortedWords.map((word, index) => (
          <div 
            key={word.german} 
            className={`${theme.card.bg} backdrop-blur-sm rounded-lg p-3 ${theme.card.hover} transition-all duration-300 hover-lift group cursor-pointer`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onWordClick?.(word)}
          >
            {/* Header with article + word + delete */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className={`${theme.text.accent} font-semibold text-sm flex-shrink-0`}>{word.article}</span>
                <h3 className={`font-bold ${theme.text.primary} capitalize truncate text-base`}>{word.german}</h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteWord(word.german);
                }}
                className={`p-1 ${theme.text.secondary} hover:text-red-400 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0`}
                title={`Delete ${word.german}`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Word type badge */}
            <div className="mb-2">
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getWordTypeClass(word.partOfSpeech, theme)}`}>
                {word.partOfSpeech}
              </span>
            </div>

            {/* Translation only */}
            <div className="mb-2">
              <p className={`${theme.text.primary} font-medium text-sm truncate`} title={word.translation}>
                {word.translation}
              </p>
            </div>

            {/* German Examples (if available) - prominently displayed */}
            {word.examples && word.examples.length > 0 && (
              <div className="mt-2 pt-2 border-t border-current/10">
                <p className={`${theme.text.accent} text-xs font-medium mb-1`}>Beispiel:</p>
                <p className={`${theme.text.secondary} text-xs italic leading-relaxed truncate`} title={word.examples[0]}>
                  "{word.examples[0]}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
