'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}: PaginationProps) {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`${theme.glass} rounded-2xl p-4 mt-6`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Results info */}
        <div className={`${theme.text.secondary} text-sm`}>
          Showing {startItem}-{endItem} of {totalItems} words
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === 1 
                ? `${theme.text.secondary} cursor-not-allowed opacity-50` 
                : `${theme.button.filter} hover:scale-105`
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page numbers */}
          <div className="flex gap-1">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${theme.button.filter} hover:scale-105`}
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className={`px-2 py-2 ${theme.text.secondary}`}>...</span>
                )}
              </>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${page === currentPage 
                    ? theme.button.filterActive 
                    : `${theme.button.filter} hover:scale-105`
                  }
                `}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className={`px-2 py-2 ${theme.text.secondary}`}>...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${theme.button.filter} hover:scale-105`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === totalPages 
                ? `${theme.text.secondary} cursor-not-allowed opacity-50` 
                : `${theme.button.filter} hover:scale-105`
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
