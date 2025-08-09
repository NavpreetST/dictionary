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
    <div className="bg-white p-4 rounded-xl shadow-md mb-8">
      {/* Part of Speech filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {posTypes.map((pos) => (
          <button
            key={pos}
            onClick={() => handlePosFilter(pos)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${ 
              filters.pos === pos
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Alphabet filters */}
      <div className="flex flex-wrap gap-1">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphaFilter(letter)}
            className={`w-8 h-8 text-xs font-medium rounded-md transition-colors capitalize ${
              filters.alpha === letter
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
