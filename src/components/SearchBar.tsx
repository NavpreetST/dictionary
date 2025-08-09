'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultCount: number;
}

export default function SearchBar({ searchTerm, onSearchChange, resultCount }: SearchBarProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${theme.glass} rounded-2xl p-4 mb-6 hover-lift`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className={`h-5 w-5 ${isFocused ? theme.text.primary : theme.text.secondary}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-12 pr-4 py-4 rounded-xl border-0 transition-all duration-300 focus:outline-none focus:ring-2
            ${theme.input.bg} ${theme.input.text} ${theme.input.placeholder} ${theme.input.border}
            ${isFocused ? 'transform scale-[1.02]' : ''}
          `}
          placeholder="Search words... (e.g., Haus, laufen, schön)"
        />
        
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              onClick={() => onSearchChange('')}
              className={`p-1 rounded-full ${theme.text.secondary} hover:${theme.text.primary} transition-colors`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {searchTerm && (
        <div className={`mt-3 flex items-center gap-2 ${theme.text.secondary} text-sm`}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>
            {resultCount} {resultCount === 1 ? 'word' : 'words'} found
            {searchTerm && ` for "${searchTerm}"`}
          </span>
        </div>
      )}
    </div>
  );
}
