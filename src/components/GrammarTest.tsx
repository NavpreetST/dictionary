'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { TestData, TestQuestion } from '@/app/grammar/page';

interface GrammarTestProps {
  testData: TestData;
  onComplete: (results: TestResults) => void;
  onCancel: () => void;
}

interface TestResults {
  answers: { [key: string]: string };
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  questionResults: {
    id: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
    explanation?: string;
  }[];
}

export default function GrammarTest({ testData, onComplete, onCancel }: GrammarTestProps) {
  const { theme } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(testData.timeLimit ? testData.timeLimit * 60 : 0);

  const currentQuestion = testData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === testData.questions.length - 1;

  // Timer effect
  useEffect(() => {
    if (!testData.timeLimit) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testData.timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkAnswer = (question: TestQuestion, userAnswer: string): boolean => {
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    
    if (question.type === 'mcq' || question.type === 'fillup') {
      return normalizedAnswer === question.correctAnswer?.toLowerCase();
    } else if (question.type === 'input' && question.correctAnswers) {
      return question.correctAnswers.some(
        correct => normalizedAnswer === correct.toLowerCase()
      );
    }
    return false;
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    const correct = checkAnswer(currentQuestion, currentAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Store the answer
    setAnswers({
      ...answers,
      [currentQuestion.id]: currentAnswer
    });
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleTestComplete();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const handleTestComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const questionResults = testData.questions.map(question => {
      const userAnswer = answers[question.id] || '';
      const correct = checkAnswer(question, userAnswer);
      
      return {
        id: question.id,
        correct,
        userAnswer,
        correctAnswer: question.correctAnswer || question.correctAnswers?.[0] || '',
        explanation: question.explanation
      };
    });

    const correctAnswers = questionResults.filter(r => r.correct).length;
    const score = questionResults.reduce((acc, result, index) => {
      return acc + (result.correct ? testData.questions[index].points : 0);
    }, 0);

    onComplete({
      answers,
      score,
      correctAnswers,
      totalQuestions: testData.questions.length,
      timeSpent,
      questionResults
    });
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <div className="space-y-3">
            <p className={`${theme.text.primary} text-lg mb-4`}>
              {currentQuestion.question}
            </p>
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!showFeedback) {
                      setCurrentAnswer(option);
                    }
                  }}
                  disabled={showFeedback}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentAnswer === option
                      ? showFeedback
                        ? checkAnswer(currentQuestion, option)
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-red-500/20 border-red-500'
                        : `${theme.button.primary} ${theme.text.primary}`
                      : `${theme.glass} ${theme.text.primary} hover:bg-white/10`
                  } border ${
                    currentAnswer === option ? 'border-current' : 'border-transparent'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'fillup':
        return (
          <div className="space-y-4">
            <p className={`${theme.text.primary} text-lg`}>
              Fill in the blank:
            </p>
            <p className={`${theme.text.primary} text-xl font-medium`}>
              {currentQuestion.germanContext || currentQuestion.question}
            </p>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={showFeedback}
              className={`w-full px-4 py-3 rounded-lg border-0 transition-all duration-300 focus:outline-none focus:ring-2 ${
                showFeedback
                  ? isCorrect
                    ? 'bg-green-500/10 ring-green-500'
                    : 'bg-red-500/10 ring-red-500'
                  : `${theme.input.bg} ${theme.input.text}`
              } ${theme.input.border}`}
              placeholder="Type your answer..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !showFeedback) {
                  handleAnswerSubmit();
                }
              }}
            />
          </div>
        );

      case 'input':
        return (
          <div className="space-y-4">
            <p className={`${theme.text.primary} text-lg`}>
              {currentQuestion.question}
            </p>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={showFeedback}
              className={`w-full px-4 py-3 rounded-lg border-0 transition-all duration-300 focus:outline-none focus:ring-2 min-h-[100px] ${
                showFeedback
                  ? isCorrect
                    ? 'bg-green-500/10 ring-green-500'
                    : 'bg-red-500/10 ring-red-500'
                  : `${theme.input.bg} ${theme.input.text}`
              } ${theme.input.border}`}
              placeholder="Type your answer..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${theme.glass} rounded-2xl p-6 md:p-8 max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
            Question {currentQuestionIndex + 1} of {testData.questions.length}
          </h2>
          <p className={`${theme.text.secondary} text-sm mt-1`}>
            {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {testData.timeLimit && (
            <div className={`${theme.text.accent} font-mono text-lg`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
          <button
            onClick={onCancel}
            className={`${theme.text.secondary} hover:${theme.text.primary} p-2 rounded-lg hover:bg-white/10 transition-all duration-200`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div
          className={`${theme.button.primary} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${((currentQuestionIndex + 1) / testData.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        {renderQuestion()}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          {!isCorrect && (
            <p className={theme.text.primary}>
              Correct answer: {currentQuestion.correctAnswer || currentQuestion.correctAnswers?.[0]}
            </p>
          )}
          {currentQuestion.explanation && (
            <p className={`${theme.text.secondary} text-sm mt-2`}>
              {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1);
              setCurrentAnswer(answers[testData.questions[currentQuestionIndex - 1].id] || '');
              setShowFeedback(false);
            }
          }}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentQuestionIndex === 0
              ? 'opacity-50 cursor-not-allowed'
              : `${theme.glass} ${theme.text.secondary} hover:${theme.text.primary} hover:bg-white/10`
          }`}
        >
          Previous
        </button>

        {!showFeedback && currentQuestion.type !== 'mcq' ? (
          <button
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer.trim()}
            className={`${theme.button.primary} ${theme.button.primaryHover} px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Submit Answer
          </button>
        ) : currentQuestion.type === 'mcq' && !showFeedback ? (
          <button
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer}
            className={`${theme.button.primary} ${theme.button.primaryHover} px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className={`${theme.button.primary} ${theme.button.primaryHover} px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105`}
          >
            {isLastQuestion ? 'Finish Test' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
