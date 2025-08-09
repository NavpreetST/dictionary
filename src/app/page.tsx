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
import WordDetailModal from '@/components/WordDetailModal';

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
  const [filters, setFilters] = useState({ pos: 'All', alpha: 'All', recent: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [wordDetailModalOpen, setWordDetailModalOpen] = useState(false);

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
      console.log('Attempting to add word:', germanWord);
      
      // Create an AbortController for timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ germanWord }),
        signal: abortController.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('API response status:', response.status);

      const data = await response.json();
      console.log('API response data:', data);
      
      if (response.ok) {
        console.log('Word added successfully by API. Optimistically updating UI.');
        // Optimistically add the new word to the state
        setWords((prevWords) => [...prevWords, data.word]);
        // Refresh the list in the background to ensure full consistency
        fetchWords(); 
        return true;
      } else {
        console.log('API response not OK. Setting error.');
        setError(data.error || 'Failed to add word');
        return false;
      }
    } catch (error) {
      console.error('Error in addWord function:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to add word. Please try again.');
      }
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

  const openWordDetail = (word: Word) => {
    setSelectedWord(word);
    setWordDetailModalOpen(true);
  };

  const closeWordDetail = () => {
    setWordDetailModalOpen(false);
    setSelectedWord(null);
  };

  // Filtering and search logic
  const filteredAndSearchedWords = useMemo(() => {
    let filtered = words;

    // Apply recently added filter (last 7 days)
    if (filters.recent) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter((word) => new Date(word.createdAt) > sevenDaysAgo);
    }

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

    // Sort results - by date if recent filter is active, otherwise alphabetically
    if (filters.recent) {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filtered.sort((a, b) => a.german.localeCompare(b.german));
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
      <div className="container mx-auto p-3 md:p-6 max-w-7xl">
        {/* Header with theme selector */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex-1 text-center">
            <h1 className={`text-3xl md:text-4xl font-light ${theme.text.primary} mb-1`}>
              Deutsch<span className={`font-semibold ${theme.text.accent}`}>Wörter</span>
            </h1>
            <p className={`${theme.text.secondary} text-sm font-light`}>
              Your personal German vocabulary
            </p>
          </div>
          <div className="absolute top-4 right-4">
            <ThemeSelector />
          </div>
        </header>

        {/* Main layout with sidebar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main content area */}
          <main className="flex-1 space-y-4">
            <FilterButtons 
              filters={filters} 
              setFilters={setFilters} 
              words={words} 
            />
            
            <WordsTable 
              words={paginatedWords} 
              onDeleteWord={openDeleteModal}
              onWordClick={openWordDetail}
            />
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredAndSearchedWords.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </main>

          {/* Right sidebar */}
          <aside className="w-full lg:w-80 space-y-4">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
              resultCount={filteredAndSearchedWords.length}
            />
            
            <WordInput onAddWord={addWord} error={error} />
          </aside>
        </div>

        {deleteModalOpen && (
          <DeleteModal
            wordToDelete={wordToDelete}
            onConfirm={() => wordToDelete && deleteWord(wordToDelete)}
            onCancel={closeDeleteModal}
          />
        )}

        <WordDetailModal
          word={selectedWord}
          isOpen={wordDetailModalOpen}
          onClose={closeWordDetail}
        />
      </div>
    </div>
  );
}
