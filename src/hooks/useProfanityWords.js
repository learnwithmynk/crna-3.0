/**
 * useProfanityWords Hook
 *
 * Manages the profanity word list for content filtering.
 *
 * Database table: profanity_words
 */

import { useState, useEffect, useCallback } from 'react';
import supabase, { isSupabaseConfigured } from '@/lib/supabase';

// Default profanity words (minimal starter list)
// Used as fallback when Supabase is not configured
const DEFAULT_WORDS = [
  'spam',
  'scam',
];

export function useProfanityWords() {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all profanity words
  const fetchWords = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Fallback to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using default profanity words');
      setTimeout(() => {
        setWords(DEFAULT_WORDS.map((word, idx) => ({
          id: idx + 1,
          word,
          created_at: new Date().toISOString(),
        })));
        setIsLoading(false);
      }, 300);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('profanity_words')
        .select('*')
        .order('word', { ascending: true });

      if (fetchError) throw fetchError;

      setWords(data || []);
    } catch (err) {
      console.error('Error fetching profanity words:', err);
      setError(err.message);
      // Fallback to default words on error
      setWords(DEFAULT_WORDS.map((word, idx) => ({
        id: idx + 1,
        word,
        created_at: new Date().toISOString(),
      })));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  // Add a new word
  const addWord = async (word) => {
    const normalized = word.toLowerCase().trim();

    // Check for duplicates
    if (words.some(w => w.word === normalized)) {
      throw new Error('Word already exists');
    }

    // Fallback to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      const newWord = {
        id: Date.now(),
        word: normalized,
        created_at: new Date().toISOString(),
      };
      setWords(prev => [...prev, newWord].sort((a, b) => a.word.localeCompare(b.word)));
      return newWord;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('profanity_words')
        .insert({ word: normalized })
        .select()
        .single();

      if (insertError) throw insertError;

      setWords(prev => [...prev, data].sort((a, b) => a.word.localeCompare(b.word)));
      return data;
    } catch (err) {
      console.error('Error adding profanity word:', err);
      throw new Error(`Failed to add word: ${err.message}`);
    }
  };

  // Add multiple words at once
  const addWords = async (wordList) => {
    const normalized = wordList
      .map(w => w.toLowerCase().trim())
      .filter(w => w && !words.some(existing => existing.word === w));

    if (normalized.length === 0) return [];

    // Fallback to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      const newWords = normalized.map((word, idx) => ({
        id: Date.now() + idx,
        word,
        created_at: new Date().toISOString(),
      }));
      setWords(prev => [...prev, ...newWords].sort((a, b) => a.word.localeCompare(b.word)));
      return newWords;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('profanity_words')
        .insert(normalized.map(word => ({ word })))
        .select();

      if (insertError) throw insertError;

      setWords(prev => [...prev, ...data].sort((a, b) => a.word.localeCompare(b.word)));
      return data;
    } catch (err) {
      console.error('Error adding profanity words:', err);
      throw new Error(`Failed to add words: ${err.message}`);
    }
  };

  // Remove a word by value
  const removeWord = async (word) => {
    const normalized = word.toLowerCase().trim();

    // Fallback to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      setWords(prev => prev.filter(w => w.word !== normalized));
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('profanity_words')
        .delete()
        .eq('word', normalized);

      if (deleteError) throw deleteError;

      setWords(prev => prev.filter(w => w.word !== normalized));
    } catch (err) {
      console.error('Error removing profanity word:', err);
      throw new Error(`Failed to remove word: ${err.message}`);
    }
  };

  // Remove multiple words by values
  const removeWords = async (wordList) => {
    const normalized = wordList.map(w => w.toLowerCase().trim());

    // Fallback to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      setWords(prev => prev.filter(w => !normalized.includes(w.word)));
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('profanity_words')
        .delete()
        .in('word', normalized);

      if (deleteError) throw deleteError;

      setWords(prev => prev.filter(w => !normalized.includes(w.word)));
    } catch (err) {
      console.error('Error removing profanity words:', err);
      throw new Error(`Failed to remove words: ${err.message}`);
    }
  };

  // Check if text contains profanity
  const checkText = useCallback((text) => {
    const lowerText = text.toLowerCase();
    const found = words.filter(w =>
      lowerText.includes(w.word)
    );
    return {
      hasProfanity: found.length > 0,
      foundWords: found.map(w => w.word),
    };
  }, [words]);

  // Export words as text (one per line)
  const exportWords = useCallback(() => {
    return words.map(w => w.word).join('\n');
  }, [words]);

  // Import words from text (one per line)
  const importWords = async (text) => {
    const wordList = text
      .split(/[\n,]/)
      .map(w => w.trim())
      .filter(w => w);

    return addWords(wordList);
  };

  return {
    words,
    isLoading,
    error,
    wordCount: words.length,
    addWord,
    addWords,
    removeWord,
    removeWords,
    checkText,
    exportWords,
    importWords,
    refetch: fetchWords,
  };
}

export default useProfanityWords;
