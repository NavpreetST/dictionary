'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import WordInput from '@/components/WordInput';
import WordsTable from '@/components/WordsTable';
import FilterButtons from '@/components/FilterButtons';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import ThemeSelector from '@/components/ThemeSelector';
import Pagination from '@/components/Pagination';

export interface Word {
  id?: number;
  german: string;
  partOfSpeech: string;
  article: string;
  definition: string;
  translation: string;
  examples?: string[];
  alternateMeanings?: string[];
  createdAt: string;
}

export default function Home() {
  const { theme } = useTheme();
  const [words, setWords] = useState<Word[]>([]);
  const [filters, setFilters] = useState({ pos: 'All', alpha: 'All' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 12;

  // Fetch all words on component mount
  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/words');
      const data = await response.json();
      
      if (response.ok) {
        setWords(data.words);
      } else {
        setError(data.error || 'Failed to fetch words');
      }
    } catch (error) {
      setError('Failed to fetch words');
      console.error('Error fetching words:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (germanWord: string) => {
    try {
      setError('');
      const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ germanWord }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchWords(); // Refresh the list
        return true;
      } else {
        setError(data.error || 'Failed to add word');
        return false;
      }
    } catch (error) {
      setError('Failed to add word');
      console.error('Error adding word:', error);
      return false;
    }
  };

  const deleteWord = async (german: string) => {
    try {
      const response = await fetch('/api/words', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ german }),
      });

      if (response.ok) {
        await fetchWords(); // Refresh the list
        setDeleteModalOpen(false);
        setWordToDelete(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete word');
      }
    } catch (error) {
      setError('Failed to delete word');
      console.error('Error deleting word:', error);
    }
  };

  const openDeleteModal = (german: string) => {
    setWordToDelete(german);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setWordToDelete(null);
  };

  // Filtering and search logic
  const filteredAndSearchedWords = useMemo(() => {
    let filtered = words;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((word) => 
        word.german.toLowerCase().includes(term) ||
        word.translation.toLowerCase().includes(term) ||
        word.definition.toLowerCase().includes(term)
      );
    }

    // Apply part of speech filter
    if (filters.pos !== 'All') {
      filtered = filtered.filter((word) => word.partOfSpeech === filters.pos);
    }

    // Apply alphabet filter
    if (filters.alpha !== 'All') {
      filtered = filtered.filter((word) => word.german.startsWith(filters.alpha));
    }

    return filtered;
  }, [words, searchTerm, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSearchedWords.length / ITEMS_PER_PAGE);
  const paginatedWords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSearchedWords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSearchedWords, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.gradient} flex items-center justify-center`}>
        <div className={`${theme.glass} p-8 rounded-2xl`}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-current mx-auto mb-4"></div>
          <p className={theme.text.primary}>Loading your vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        {/* Header with theme selector */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex-1 text-center">
            <h1 className={`text-4xl md:text-5xl font-light ${theme.text.primary} mb-2`}>
              Deutsch<span className={`font-semibold ${theme.text.accent}`}>Wörter</span>
            </h1>
            <p className={`${theme.text.secondary} text-lg font-light`}>
              Your personal space to master German vocabulary
            </p>
          </div>
          <div className="absolute top-4 right-4">
            <ThemeSelector />
          </div>
        </header>

        <main className="space-y-6">
          <WordInput onAddWord={addWord} error={error} />
          
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            resultCount={filteredAndSearchedWords.length}
          />
          
          <FilterButtons 
            filters={filters} 
            setFilters={setFilters} 
            words={words} 
          />
          
          <WordsTable 
            words={paginatedWords} 
            onDeleteWord={openDeleteModal} 
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredAndSearchedWords.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </main>

        {deleteModalOpen && (
          <DeleteModal
            wordToDelete={wordToDelete}
            onConfirm={() => wordToDelete && deleteWord(wordToDelete)}
            onCancel={closeDeleteModal}
          />
        )}
      </div>
    </div>
  );
}
