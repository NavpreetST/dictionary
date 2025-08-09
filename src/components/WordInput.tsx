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
    <div className={`${theme.glass} rounded-2xl p-6 hover-lift animate-slide-in`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-grow px-4 py-3 rounded-xl border-0 transition-all duration-300 focus:outline-none focus:ring-2 ${theme.input.bg} ${theme.input.text} ${theme.input.placeholder} ${theme.input.border}`}
          placeholder="Enter a German word... (e.g., Haus, laufen, schön)"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${theme.button.primary} ${theme.button.primaryHover}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : (
            <>              
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Word
            </>
          )}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
