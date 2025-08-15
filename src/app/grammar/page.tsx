'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import GrammarTopicInput from '@/components/GrammarTopicInput';
import GrammarExplanation from '@/components/GrammarExplanation';
import GrammarTest from '@/components/GrammarTest';
import TestResults from '@/components/TestResults';

export interface GrammarTopic {
  topic: string;
  explanation: string;
  examples: {
    german: string;
    english: string;
    highlight?: string;
  }[];
  rules: string[];
  tips?: string[];
}

export interface TestQuestion {
  id: string;
  type: 'mcq' | 'fillup' | 'input';
  question: string;
  germanContext?: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[]; // For multiple correct answers
  blank?: string; // For fill-ups, the word to fill
  explanation?: string;
  points: number;
}

export interface TestData {
  questions: TestQuestion[];
  totalPoints: number;
  passingScore: number;
  timeLimit?: number; // in minutes
}

// Dummy data for development
const dummyTopicData: GrammarTopic = {
  topic: "Genitiv (Genitive Case)",
  explanation: "The genitive case (Genitiv) in German is used to show possession or belonging. It answers the question 'whose?' (wessen?). While less common in spoken German, it's essential in formal writing and certain expressions.",
  examples: [
    {
      german: "Das ist das Auto meines Vaters.",
      english: "That is my father's car.",
      highlight: "meines Vaters"
    },
    {
      german: "Die Farbe des Himmels ist blau.",
      english: "The color of the sky is blue.",
      highlight: "des Himmels"
    },
    {
      german: "Das Haus der Familie ist groß.",
      english: "The family's house is big.",
      highlight: "der Familie"
    },
    {
      german: "Die Spielzeuge der Kinder liegen überall.",
      english: "The children's toys are everywhere.",
      highlight: "der Kinder"
    }
  ],
  rules: [
    "Masculine and neuter nouns: add -s or -es to the noun, article becomes 'des' (definite) or 'eines' (indefinite)",
    "Feminine and plural nouns: no change to the noun, article becomes 'der' (definite) or 'einer' (indefinite)",
    "Adjectives in genitive take -en ending after definite articles",
    "Some prepositions always require genitive: während, wegen, trotz, aufgrund, anstatt"
  ],
  tips: [
    "In spoken German, 'von + dative' is often used instead of genitive",
    "Names add -s without apostrophe: Peters Buch (Peter's book)",
    "Pay attention to weak nouns (n-declension) which add -n or -en"
  ]
};

const dummyTestData: TestData = {
  questions: [
    {
      id: "1",
      type: "mcq",
      question: "Choose the correct genitive form: Das ist das Buch ___ Lehrers.",
      options: ["der", "des", "dem", "den"],
      correctAnswer: "des",
      explanation: "Masculine nouns use 'des' in genitive case",
      points: 1
    },
    {
      id: "2",
      type: "fillup",
      question: "Die Tür ___ Hauses ist rot.",
      germanContext: "Die Tür ___ Hauses ist rot.",
      blank: "des",
      correctAnswer: "des",
      explanation: "Neuter noun 'Haus' requires 'des' in genitive",
      points: 1
    },
    {
      id: "3",
      type: "input",
      question: "Translate to German: 'The woman's car' (Use: Auto, Frau)",
      correctAnswers: ["Das Auto der Frau", "der Frau Auto"],
      explanation: "Feminine nouns use 'der' in genitive, word order can vary",
      points: 2
    },
    {
      id: "4",
      type: "mcq",
      question: "Which preposition does NOT require genitive case?",
      options: ["wegen", "trotz", "mit", "während"],
      correctAnswer: "mit",
      explanation: "'mit' requires dative case, not genitive",
      points: 1
    },
    {
      id: "5",
      type: "fillup",
      question: "Wegen ___ Wetters bleiben wir zu Hause.",
      blank: "des",
      correctAnswer: "des",
      explanation: "'Wetter' is neuter, so it uses 'des' in genitive after 'wegen'",
      points: 1
    },
    {
      id: "6",
      type: "input",
      question: "Form the genitive: 'the children's books' (Use: Bücher, Kinder)",
      correctAnswers: ["die Bücher der Kinder", "der Kinder Bücher"],
      explanation: "Plural nouns use 'der' in genitive",
      points: 2
    }
  ],
  totalPoints: 8,
  passingScore: 6,
  timeLimit: 10
};

export default function GrammarPage() {
  const { theme } = useTheme();
  const [currentTopic, setCurrentTopic] = useState<GrammarTopic | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTopicSubmit = async (topic: string) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, use dummy data
    setCurrentTopic(dummyTopicData);
    setTestData(dummyTestData);
    setShowTest(false);
    setTestResults(null);
    setLoading(false);
  };

  const handleStartTest = () => {
    if (testData) {
      setShowTest(true);
      setTestResults(null);
    }
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setShowTest(false);
  };

  const handleReset = () => {
    setCurrentTopic(null);
    setTestData(null);
    setShowTest(false);
    setTestResults(null);
  };

  const handleRetakeTest = () => {
    setTestResults(null);
    setShowTest(true);
  };

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <div className="container mx-auto p-3 md:p-6 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-light ${theme.text.primary} mb-2`}>
            German <span className={`font-semibold ${theme.text.accent}`}>Grammar Learning</span>
          </h1>
          <p className={`${theme.text.secondary} text-sm font-light`}>
            Master German grammar with explanations and interactive tests
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {!currentTopic && !loading && (
            <GrammarTopicInput onSubmit={handleTopicSubmit} />
          )}

          {loading && (
            <div className={`${theme.glass} rounded-2xl p-12 text-center`}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
              <p className={theme.text.primary}>Loading grammar topic...</p>
            </div>
          )}

          {currentTopic && !showTest && !testResults && (
            <>
              <GrammarExplanation topic={currentTopic} />
              
              {testData && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleStartTest}
                    className={`${theme.button.primary} ${theme.button.primaryHover} px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`}
                  >
                    Start Practice Test
                  </button>
                  <button
                    onClick={handleReset}
                    className={`${theme.glass} ${theme.text.secondary} hover:${theme.text.primary} px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-current/20`}
                  >
                    Choose Another Topic
                  </button>
                </div>
              )}
            </>
          )}

          {showTest && testData && (
            <GrammarTest 
              testData={testData} 
              onComplete={handleTestComplete}
              onCancel={() => setShowTest(false)}
            />
          )}

          {testResults && (
            <>
              <TestResults 
                results={testResults} 
                totalPoints={testData?.totalPoints || 0}
                passingScore={testData?.passingScore || 0}
              />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetakeTest}
                  className={`${theme.button.primary} ${theme.button.primaryHover} px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`}
                >
                  Retake Test
                </button>
                <button
                  onClick={handleReset}
                  className={`${theme.glass} ${theme.text.secondary} hover:${theme.text.primary} px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-current/20`}
                >
                  Learn New Topic
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
