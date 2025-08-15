'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface GrammarTopicInputProps {
  onSubmit: (topic: string) => void;
}

const popularTopics = [
  'Nominativ (Nominative Case)',
  'Akkusativ (Accusative Case)', 
  'Dativ (Dative Case)',
  'Genitiv (Genitive Case)',
  'Präsens (Present Tense)',
  'Perfekt (Perfect Tense)',
  'Präteritum (Simple Past)',
  'Futur (Future Tense)',
  'Konjunktiv II (Subjunctive II)',
  'Passiv (Passive Voice)',
  'Modalverben (Modal Verbs)',
  'Trennbare Verben (Separable Verbs)',
  'Reflexive Verben (Reflexive Verbs)',
  'Adjektivdeklination (Adjective Declension)',
  'Komparativ und Superlativ (Comparative and Superlative)',
  'Präpositionen (Prepositions)',
  'Relativsätze (Relative Clauses)',
  'Konjunktionen (Conjunctions)',
  'Wortstellung (Word Order)',
  'Indirekte Rede (Indirect Speech)'
];

export default function GrammarTopicInput({ onSubmit }: GrammarTopicInputProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  const handleTopicSelect = (topic: string) => {
    setInputValue(topic);
    setShowSuggestions(false);
    onSubmit(topic);
  };

  const filteredTopics = popularTopics.filter(topic =>
    topic.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={`${theme.glass} rounded-2xl p-8 max-w-3xl mx-auto`}>
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-semibold ${theme.text.primary} mb-2`}>
          Choose a Grammar Topic
        </h2>
        <p className={`${theme.text.secondary} text-sm`}>
          Enter a German grammar topic you want to learn about
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className={`w-full px-4 py-3 rounded-lg border-0 transition-all duration-300 focus:outline-none focus:ring-2 ${theme.input.bg} ${theme.input.text} ${theme.input.placeholder} ${theme.input.border}`}
            placeholder="e.g., Genitiv, Perfekt, Modal Verbs..."
            autoComplete="off"
          />

          {showSuggestions && inputValue && filteredTopics.length > 0 && (
            <div className={`absolute top-full mt-2 w-full ${theme.glass} rounded-lg overflow-hidden shadow-xl z-10 max-h-60 overflow-y-auto`}>
              {filteredTopics.slice(0, 5).map((topic, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTopicSelect(topic)}
                  className={`w-full text-left px-4 py-3 ${theme.text.primary} hover:${theme.text.accent} hover:bg-white/10 transition-colors duration-200`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`w-full ${theme.button.primary} ${theme.button.primaryHover} px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          Learn This Topic
        </button>
      </form>

      <div className="mt-8">
        <p className={`${theme.text.secondary} text-sm mb-4 text-center`}>
          Popular topics to get started:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {popularTopics.slice(0, 8).map((topic, index) => (
            <button
              key={index}
              onClick={() => handleTopicSelect(topic)}
              className={`px-3 py-1.5 rounded-full text-sm ${theme.glass} ${theme.text.secondary} hover:${theme.text.primary} hover:bg-white/10 transition-all duration-200 border border-current/20`}
            >
              {topic.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
