'use client';

import { Word } from '@/app/page';
import { useTheme } from '@/contexts/ThemeContext';

interface FilterButtonsProps {
  filters: { pos: string; alpha: string; recent: boolean };
  setFilters: (filters: { pos: string; alpha: string; recent: boolean }) => void;
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

  const handleRecentFilter = () => {
    setFilters({ ...filters, recent: !filters.recent });
  };

  return (
    <div className={`${theme.glass} rounded-xl p-3 hover-lift`}>
      {/* Recently Added filter */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
        <button
          onClick={handleRecentFilter}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 ${
            filters.recent
              ? theme.button.filterActive
              : theme.button.filter
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recently Added
        </button>
        <span className={`${theme.text.secondary} text-xs`}>
          ({filters.recent ? 'Last 7 days' : 'All time'})
        </span>
      </div>

      {/* Part of Speech filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`${theme.text.secondary} font-medium text-xs self-center mr-1`}>Type:</span>
        {posTypes.map((pos) => (
          <button
            key={pos}
            onClick={() => handlePosFilter(pos)}
            className={`px-3 py-1 rounded-md font-medium text-xs transition-all duration-200 hover:scale-105 ${ 
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
      <div className="flex flex-wrap gap-1">
        <span className={`${theme.text.secondary} font-medium text-xs self-center mr-1`}>Letter:</span>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphaFilter(letter)}
            className={`w-6 h-6 text-xs font-semibold rounded-md transition-all duration-200 hover:scale-105 capitalize ${
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
