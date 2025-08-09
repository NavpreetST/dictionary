'use client';

import { Word } from '@/app/page';

interface FilterButtonsProps {
  filters: { pos: string; alpha: string };
  setFilters: (filters: { pos: string; alpha: string }) => void;
  words: Word[];
}

export default function FilterButtons({ filters, setFilters, words }: FilterButtonsProps) {
  const posTypes = ['All', 'Noun', 'Verb', 'Adjective', 'Other'];
  const alphabet = ['All', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

  const handlePosFilter = (pos: string) => {
    setFilters({ ...filters, pos });
  };

  const handleAlphaFilter = (alpha: string) => {
    setFilters({ ...filters, alpha });
  };

  return (
    <div className="glass rounded-2xl p-6 mb-8 hover-lift">
      {/* Part of Speech filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="text-white/90 font-medium text-sm self-center mr-2">Filter by type:</span>
        {posTypes.map((pos) => (
          <button
            key={pos}
            onClick={() => handlePosFilter(pos)}
            className={`btn-filter ${ 
              filters.pos === pos
                ? 'btn-filter-active'
                : 'btn-filter-inactive'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Alphabet filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-white/90 font-medium text-sm self-center mr-2">Filter by letter:</span>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphaFilter(letter)}
            className={`w-9 h-9 text-xs font-semibold rounded-lg transition-colors capitalize ${
              filters.alpha === letter
                ? 'bg-white text-gray-800 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
