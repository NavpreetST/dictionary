'use client';

import { Word } from '@/app/page';
import { useTheme } from '@/contexts/ThemeContext';

interface FilterButtonsProps {
  filters: { pos: string; alpha: string };
  setFilters: (filters: { pos: string; alpha: string }) => void;
  words: Word[];
}

export default function FilterButtons({ filters, setFilters, words }: FilterButtonsProps) {
  const { theme } = useTheme();
  const posTypes = ['All', 'Noun', 'Verb', 'Adjective', 'Other'];
  const alphabet = ['All', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

  const handlePosFilter = (pos: string) => {
    setFilters({ ...filters, pos });
  };

  const handleAlphaFilter = (alpha: string) => {
    setFilters({ ...filters, alpha });
  };

  return (
    <div className={`${theme.glass} rounded-2xl p-6 hover-lift`}>
      {/* Part of Speech filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className={`${theme.text.secondary} font-medium text-sm self-center mr-2`}>Filter by type:</span>
        {posTypes.map((pos) => (
          <button
            key={pos}
            onClick={() => handlePosFilter(pos)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 ${ 
              filters.pos === pos
                ? theme.button.filterActive
                : theme.button.filter
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Alphabet filters */}
      <div className="flex flex-wrap gap-2">
        <span className={`${theme.text.secondary} font-medium text-sm self-center mr-2`}>Filter by letter:</span>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphaFilter(letter)}
            className={`w-9 h-9 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 capitalize ${
              filters.alpha === letter
                ? theme.button.filterActive
                : theme.button.filter
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
