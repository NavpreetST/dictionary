'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { GrammarTopic } from '@/app/grammar/page';

interface GrammarExplanationProps {
  topic: GrammarTopic;
}

export default function GrammarExplanation({ topic }: GrammarExplanationProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <div className={`${theme.glass} rounded-2xl p-6`}>
        <h2 className={`text-2xl font-bold ${theme.text.accent} mb-4`}>
          {topic.topic}
        </h2>
        <p className={`${theme.text.primary} leading-relaxed`}>
          {topic.explanation}
        </p>
      </div>

      {/* Grammar Rules */}
      <div className={`${theme.glass} rounded-2xl p-6`}>
        <h3 className={`text-xl font-semibold ${theme.text.primary} mb-4 flex items-center gap-2`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Grammar Rules
        </h3>
        <ul className="space-y-3">
          {topic.rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className={`${theme.text.accent} font-bold mt-0.5`}>{index + 1}.</span>
              <span className={theme.text.primary}>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Examples */}
      <div className={`${theme.glass} rounded-2xl p-6`}>
        <h3 className={`text-xl font-semibold ${theme.text.primary} mb-4 flex items-center gap-2`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Examples
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {topic.examples.map((example, index) => (
            <div key={index} className={`${theme.card.bg} rounded-lg p-4 ${theme.card.hover} transition-all duration-300`}>
              <p className={`${theme.text.primary} font-medium mb-2`}>
                {example.highlight ? (
                  <>
                    {example.german.split(example.highlight)[0]}
                    <span className={`${theme.text.accent} font-bold underline decoration-2 underline-offset-2`}>
                      {example.highlight}
                    </span>
                    {example.german.split(example.highlight)[1]}
                  </>
                ) : (
                  example.german
                )}
              </p>
              <p className={`${theme.text.secondary} text-sm italic`}>
                {example.english}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {topic.tips && topic.tips.length > 0 && (
        <div className={`${theme.glass} rounded-2xl p-6`}>
          <h3 className={`text-xl font-semibold ${theme.text.primary} mb-4 flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Pro Tips
          </h3>
          <div className="space-y-3">
            {topic.tips.map((tip, index) => (
              <div key={index} className={`flex items-start gap-3 ${theme.card.bg} rounded-lg p-3`}>
                <span className={`${theme.text.accent} text-lg`}>💡</span>
                <span className={`${theme.text.primary} text-sm`}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
