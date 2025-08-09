'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/lib/themes';

export default function ThemeSelector() {
  const { currentTheme, setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl ${theme.glass} ${theme.text.primary} hover:scale-105 transition-all duration-200 shadow-lg`}
        title="Change Theme"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute top-full right-0 mt-2 w-48 ${theme.glass} rounded-xl shadow-2xl z-50 overflow-hidden`}>
            <div className={`p-2 ${theme.text.secondary} text-xs font-medium border-b ${theme.card.border}`}>
              Choose Theme
            </div>
            <div className="p-2 space-y-1">
              {Object.entries(themes).map(([key, themeOption]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 ${
                    currentTheme === key 
                      ? theme.button.filterActive
                      : `${theme.text.primary} hover:bg-white/10`
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${themeOption.gradient.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`} />
                  {themeOption.name}
                  {currentTheme === key && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
