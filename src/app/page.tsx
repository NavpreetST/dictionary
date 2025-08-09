'use client';

import { useState, useEffect } from 'react';
import WordInput from '@/components/WordInput';
import WordsTable from '@/components/WordsTable';
import FilterButtons from '@/components/FilterButtons';
import DeleteModal from '@/components/DeleteModal';

export interface Word {
  id?: number;
  german: string;
  partOfSpeech: string;
  article: string;
  definition: string;
  translation: string;
  createdAt: string;
}

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [filters, setFilters] = useState({ pos: 'All', alpha: 'All' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);

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

  const filteredWords = words.filter((word) => {
    const posMatch = filters.pos === 'All' || word.partOfSpeech === filters.pos;
    const alphaMatch = filters.alpha === 'All' || word.german.startsWith(filters.alpha);
    return posMatch && alphaMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Mein persönliches Wörterbuch</h1>
          <p className="text-gray-600 mt-2">Your personal space to grow your German vocabulary.</p>
        </header>

        <main>
          <WordInput onAddWord={addWord} error={error} />
          <FilterButtons filters={filters} setFilters={setFilters} words={words} />
          <WordsTable words={filteredWords} onDeleteWord={openDeleteModal} />
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
