'use client';

import { Word } from '@/app/page';

interface WordsTableProps {
  words: Word[];
  onDeleteWord: (german: string) => void;
}

export default function WordsTable({ words, onDeleteWord }: WordsTableProps) {
  if (words.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="text-center py-10 px-6">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No words found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or adding a new word.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="table-container overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                German
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                English
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Definition
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {words.map((word) => (
              <tr key={word.german} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {word.article}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 capitalize">
                  {word.german}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {word.partOfSpeech}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {word.translation}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={word.definition}>
                  {word.definition}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDeleteWord(word.german)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title={`Delete ${word.german}`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
