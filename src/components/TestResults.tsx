'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface TestResultsProps {
  results: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
    questionResults: {
      id: string;
      correct: boolean;
      userAnswer: string;
      correctAnswer: string;
      explanation?: string;
    }[];
  };
  totalPoints: number;
  passingScore: number;
}

export default function TestResults({ results, totalPoints, passingScore }: TestResultsProps) {
  const { theme } = useTheme();
  
  const percentage = Math.round((results.score / totalPoints) * 100);
  const passed = results.score >= passingScore;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = () => {
    if (percentage >= 95) return { grade: 'A+', color: 'text-green-400', message: 'Outstanding!' };
    if (percentage >= 90) return { grade: 'A', color: 'text-green-400', message: 'Excellent!' };
    if (percentage >= 85) return { grade: 'B+', color: 'text-blue-400', message: 'Very Good!' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-400', message: 'Good!' };
    if (percentage >= 75) return { grade: 'C+', color: 'text-yellow-400', message: 'Satisfactory' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-400', message: 'Acceptable' };
    if (percentage >= 65) return { grade: 'D', color: 'text-orange-400', message: 'Needs Improvement' };
    return { grade: 'F', color: 'text-red-400', message: 'Try Again' };
  };

  const gradeInfo = getGrade();

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <div className={`${theme.glass} rounded-2xl p-8 text-center`}>
        <div className="mb-6">
          <div className={`text-6xl mb-2 ${passed ? 'animate-bounce' : ''}`}>
            {passed ? '🎉' : '📚'}
          </div>
          <h2 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          <p className={`${theme.text.secondary}`}>
            {passed ? 'You passed the test!' : 'You didn\'t pass this time, but don\'t give up!'}
          </p>
        </div>

        {/* Score Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
              className={`${passed ? 'text-green-400' : 'text-orange-400'} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${gradeInfo.color}`}>
              {gradeInfo.grade}
            </span>
            <span className={`text-2xl font-semibold ${theme.text.primary}`}>
              {percentage}%
            </span>
            <span className={`text-sm ${theme.text.secondary}`}>
              {gradeInfo.message}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${theme.card.bg} rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${theme.text.accent}`}>
              {results.score}/{totalPoints}
            </div>
            <div className={`text-sm ${theme.text.secondary}`}>Points</div>
          </div>
          
          <div className={`${theme.card.bg} rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${theme.text.accent}`}>
              {results.correctAnswers}/{results.totalQuestions}
            </div>
            <div className={`text-sm ${theme.text.secondary}`}>Correct</div>
          </div>
          
          <div className={`${theme.card.bg} rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${theme.text.accent}`}>
              {formatTime(results.timeSpent)}
            </div>
            <div className={`text-sm ${theme.text.secondary}`}>Time</div>
          </div>
          
          <div className={`${theme.card.bg} rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
              {passed ? 'PASS' : 'FAIL'}
            </div>
            <div className={`text-sm ${theme.text.secondary}`}>Status</div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className={`${theme.glass} rounded-2xl p-6`}>
        <h3 className={`text-xl font-semibold ${theme.text.primary} mb-4`}>
          Question Review
        </h3>
        
        <div className="space-y-3">
          {results.questionResults.map((question, index) => (
            <div
              key={question.id}
              className={`${theme.card.bg} rounded-lg p-4 border-l-4 ${
                question.correct ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`font-medium ${theme.text.primary}`}>
                  Question {index + 1}
                </span>
                <span className={`text-sm font-medium ${
                  question.correct ? 'text-green-400' : 'text-red-400'
                }`}>
                  {question.correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              
              {!question.correct && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className={`${theme.text.secondary}`}>Your answer: </span>
                    <span className={theme.text.primary}>
                      {question.userAnswer || '(No answer)'}
                    </span>
                  </div>
                  <div>
                    <span className={`${theme.text.secondary}`}>Correct answer: </span>
                    <span className="text-green-400">
                      {question.correctAnswer}
                    </span>
                  </div>
                  {question.explanation && (
                    <div className={`${theme.text.secondary} italic mt-2`}>
                      {question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className={`${theme.glass} rounded-2xl p-6`}>
        <h3 className={`text-xl font-semibold ${theme.text.primary} mb-4`}>
          Performance Analysis
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className={theme.text.secondary}>Accuracy</span>
              <span className={`font-medium ${theme.text.primary}`}>
                {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(results.correctAnswers / results.totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className={theme.text.secondary}>Speed</span>
              <span className={`font-medium ${theme.text.primary}`}>
                {Math.round(results.timeSpent / results.totalQuestions)}s per question
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.max(20, Math.min(100, 100 - (results.timeSpent / results.totalQuestions) * 2))}%` 
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className={`mt-6 p-4 ${theme.card.bg} rounded-lg`}>
          <h4 className={`font-medium ${theme.text.primary} mb-2`}>
            Recommendations
          </h4>
          <ul className={`${theme.text.secondary} text-sm space-y-1`}>
            {percentage < 70 && (
              <li>• Review the grammar rules and examples carefully</li>
            )}
            {results.timeSpent / results.totalQuestions > 60 && (
              <li>• Practice more to improve your response time</li>
            )}
            {percentage >= 70 && percentage < 90 && (
              <li>• You're doing well! Focus on the questions you missed</li>
            )}
            {percentage >= 90 && (
              <li>• Excellent work! Try more advanced topics</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
