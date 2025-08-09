'use client';

import { Word } from '@/app/page';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect } from 'react';

interface WordDetailModalProps {
  word: Word | null;
  isOpen: boolean;
  onClose: () => void;
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

export default function WordDetailModal({ word, isOpen, onClose }: WordDetailModalProps) {
  const { theme } = useTheme();

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !word) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${theme.glass} rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className={`${theme.text.accent} font-bold text-xl`}>{word.article}</span>
            <h2 className={`font-bold ${theme.text.primary} text-2xl capitalize`}>{word.german}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWordTypeClass(word.partOfSpeech, theme)}`}>
              {word.partOfSpeech}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${theme.text.secondary} hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200`}
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Translation and Definition */}
          <div className="space-y-3">
            <div>
              <h3 className={`${theme.text.accent} font-semibold text-sm uppercase tracking-wide mb-2`}>
                English Translation
              </h3>
              <p className={`${theme.text.primary} text-lg font-medium`}>
                {word.translation}
              </p>
            </div>
            
            <div>
              <h3 className={`${theme.text.accent} font-semibold text-sm uppercase tracking-wide mb-2`}>
                Definition
              </h3>
              <p className={`${theme.text.secondary} leading-relaxed`}>
                {word.definition}
              </p>
            </div>
          </div>

          {/* German Examples */}
          {word.examples && word.examples.length > 0 && (
            <div>
              <h3 className={`${theme.text.accent} font-semibold text-sm uppercase tracking-wide mb-3`}>
                German Examples
              </h3>
              <div className="space-y-3">
                {word.examples.slice(0, 3).map((example, index) => (
                  <div key={index} className={`${theme.card.bg} rounded-lg p-4`}>
                    <p className={`${theme.text.primary} italic text-lg`}>
                      "{example}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternate Meanings */}
          {word.alternateMeanings && word.alternateMeanings.length > 0 && (
            <div>
              <h3 className={`${theme.text.accent} font-semibold text-sm uppercase tracking-wide mb-3`}>
                Alternate Meanings
              </h3>
              <div className="space-y-2">
                {word.alternateMeanings.map((meaning, index) => (
                  <div key={index} className={`flex items-start gap-3 ${theme.card.bg} rounded-lg p-3`}>
                    <span className={`${theme.text.accent} font-bold text-sm flex-shrink-0 mt-0.5`}>
                      {index + 1}.
                    </span>
                    <p className={`${theme.text.primary}`}>
                      {meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Word Information */}
          <div>
            <h3 className={`${theme.text.accent} font-semibold text-sm uppercase tracking-wide mb-3`}>
              Word Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${theme.card.bg} rounded-lg p-4`}>
                <div className={`${theme.text.secondary} text-sm mb-1`}>Part of Speech</div>
                <div className={`${theme.text.primary} font-medium`}>{word.partOfSpeech}</div>
              </div>
              
              {word.article && (
                <div className={`${theme.card.bg} rounded-lg p-4`}>
                  <div className={`${theme.text.secondary} text-sm mb-1`}>Article</div>
                  <div className={`${theme.text.primary} font-medium`}>{word.article}</div>
                </div>
              )}
              
              <div className={`${theme.card.bg} rounded-lg p-4`}>
                <div className={`${theme.text.secondary} text-sm mb-1`}>Added</div>
                <div className={`${theme.text.primary} font-medium`}>
                  {new Date(word.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className={`${theme.button.primary} px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
