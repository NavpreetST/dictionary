'use client';

import { Word } from '@/app/page';
import { useTheme } from '@/contexts/ThemeContext';

interface WordsTableProps {
  words: Word[];
  onDeleteWord: (german: string) => void;
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

export default function WordsTable({ words, onDeleteWord }: WordsTableProps) {
  const { theme } = useTheme();
  
  if (words.length === 0) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="text-center py-16 px-6">
          <svg 
            className="mx-auto h-16 w-16 text-white/60 mb-4" 
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
          <h3 className="text-lg font-medium text-white/90 mb-2">No words found</h3>
          <p className="text-white/70">Try adjusting your filters or adding a new word to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="grid gap-4 p-6">
        {words.map((word, index) => (
          <div 
            key={word.german} 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 font-medium text-lg">{word.article}</span>
                    <h3 className="text-2xl font-semibold text-white capitalize">{word.german}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getWordTypeClass(word.partOfSpeech)}`}>
                    {word.partOfSpeech}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/90 font-medium mb-1">{word.translation}</p>
                    <p className="text-white/70 text-sm">{word.definition}</p>
                  </div>
                  
                  <div>
                    {word.examples && word.examples.length > 0 && (
                      <div>
                        <h4 className="text-white/90 font-medium text-sm mb-2">Examples:</h4>
                        <ul className="space-y-1">
                          {word.examples.slice(0, 2).map((example, i) => (
                            <li key={i} className="text-white/70 text-sm italic">
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {word.alternateMeanings && word.alternateMeanings.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-white/90 font-medium text-sm mb-1">Also means:</h4>
                        <p className="text-white/70 text-sm">
                          {word.alternateMeanings.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteWord(word.german)}
                className="ml-4 p-2 text-white/40 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                title={`Delete ${word.german}`}
              >
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
