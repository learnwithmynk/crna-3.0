/**
 * DrugFlashcardWidget Component
 *
 * Container widget for drug flashcards.
 * Shows flashcards for medications the user has logged.
 * Tracks progress and prioritizes recently logged or unreviewed drugs.
 */

import { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Brain,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DrugFlashcard } from './DrugFlashcard';
import {
  getFlashcardsForLoggedMeds,
  getRandomQuestion,
  getAvailableFlashcardMeds,
} from '@/data/drugFlashcards';

/**
 * Extract unique medication IDs from entries
 */
function extractLoggedMedications(entries) {
  const meds = new Set();
  entries.forEach((entry) => {
    entry.medications?.forEach((m) => {
      const id = typeof m === 'string' ? m : m.medicationId;
      meds.add(id);
    });
  });
  return Array.from(meds);
}

/**
 * Main DrugFlashcardWidget component
 */
export function DrugFlashcardWidget({ entries, className }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [reviewedMeds, setReviewedMeds] = useState(new Set());

  // Get medications the user has logged that have flashcards
  const loggedMeds = useMemo(() => extractLoggedMedications(entries), [entries]);
  const availableFlashcards = useMemo(() => getAvailableFlashcardMeds(), []);

  // Filter to only medications with flashcard content
  const medsWithFlashcards = useMemo(
    () => loggedMeds.filter((id) => availableFlashcards.includes(id)),
    [loggedMeds, availableFlashcards]
  );

  // Get flashcard data for logged meds
  const flashcards = useMemo(
    () => getFlashcardsForLoggedMeds(medsWithFlashcards),
    [medsWithFlashcards]
  );

  // Get current question
  const currentQuestion = useMemo(() => {
    if (flashcards.length === 0) return null;

    const flashcard = flashcards[currentIndex % flashcards.length];
    if (!flashcard) return null;

    // Get a random question from this medication's flashcard
    const randomQ = flashcard.questions[Math.floor(Math.random() * flashcard.questions.length)];

    return {
      ...randomQ,
      medicationName: flashcard.name,
      medicationId: flashcard.medicationId,
    };
  }, [flashcards, currentIndex]);

  // Handlers
  const handleCorrect = useCallback(() => {
    setCorrectCount((prev) => prev + 1);
    setTotalAttempts((prev) => prev + 1);
    if (currentQuestion) {
      setReviewedMeds((prev) => new Set([...prev, currentQuestion.medicationId]));
    }
  }, [currentQuestion]);

  const handleIncorrect = useCallback(() => {
    setTotalAttempts((prev) => prev + 1);
    if (currentQuestion) {
      setReviewedMeds((prev) => new Set([...prev, currentQuestion.medicationId]));
    }
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, flashcards.length));
  }, [flashcards.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, flashcards.length - 1) : prev - 1
    );
  }, [flashcards.length]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setReviewedMeds(new Set());
  }, []);

  // Empty state - no logged medications
  if (!entries || entries.length === 0) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="text-center py-6">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h4 className="font-medium text-gray-600 mb-1">Drug Flashcards</h4>
          <p className="text-sm text-gray-500">
            Log your first shift to unlock flashcards for medications you've used
          </p>
        </div>
      </Card>
    );
  }

  // Empty state - no flashcards for logged medications
  if (medsWithFlashcards.length === 0) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="text-center py-6">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h4 className="font-medium text-gray-600 mb-1">Drug Flashcards</h4>
          <p className="text-sm text-gray-500">
            Log medications like norepinephrine, propofol, or fentanyl to see their flashcards
          </p>
        </div>
      </Card>
    );
  }

  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return (
    <Card className={cn('p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900">Drug Flashcards</h4>
        </div>
        <Badge variant="outline" className="text-xs">
          {medsWithFlashcards.length} drugs
        </Badge>
      </div>

      {/* Progress stats */}
      <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">
            Reviewed: <strong className="text-gray-700">{reviewedMeds.size}</strong>/{medsWithFlashcards.length}
          </span>
          {totalAttempts > 0 && (
            <span className="text-gray-500">
              Accuracy: <strong className={cn(
                accuracy >= 80 ? 'text-green-600' :
                accuracy >= 60 ? 'text-amber-600' :
                'text-red-600'
              )}>{accuracy}%</strong>
            </span>
          )}
        </div>
        {totalAttempts > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Current flashcard */}
      {currentQuestion && (
        <DrugFlashcard
          question={currentQuestion.question}
          answer={currentQuestion.answer}
          type={currentQuestion.type}
          medicationName={currentQuestion.medicationName}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onNext={handleNext}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={flashcards.length <= 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </Button>

        <span className="text-xs text-gray-500">
          {(currentIndex % flashcards.length) + 1} of {flashcards.length}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={flashcards.length <= 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Achievement */}
      {reviewedMeds.size === medsWithFlashcards.length && medsWithFlashcards.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              All drugs reviewed! 🎉
            </p>
            <p className="text-xs text-amber-600">
              Log more medications to unlock new flashcards
            </p>
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Flashcards are based on medications you've logged
        </p>
      </div>
    </Card>
  );
}

export default DrugFlashcardWidget;
