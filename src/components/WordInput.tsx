'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface WordInputProps {
  onAddWord: (germanWord: string) => Promise<boolean>;
  error: string;
}

export default function WordInput({ onAddWord, error }: WordInputProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    const success = await onAddWord(inputValue.trim());
    
    if (success) {
      setInputValue('');
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className={`${theme.glass} rounded-xl p-3 hover-lift animate-slide-in`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 px-3 py-2 rounded-lg border-0 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${theme.input.bg} ${theme.input.text} ${theme.input.placeholder} ${theme.input.border}`}
          placeholder="Enter a German word..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center min-w-[70px] ${theme.button.primary} ${theme.button.primaryHover}`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
              <span className="text-xs">Add</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs">Add</span>
            </>
          )}
        </button>
      </form>
      {error && (
        <div className="mt-3 p-2 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-lg text-red-700 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
