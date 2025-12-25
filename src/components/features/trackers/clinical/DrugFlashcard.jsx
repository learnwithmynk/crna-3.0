/**
 * DrugFlashcard Component
 *
 * Individual flashcard with flip animation.
 * Shows question on front, answer on back.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Pill,
  Zap,
  Activity,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Get icon for question type
 */
function getTypeIcon(type) {
  switch (type) {
    case 'mechanism': return Zap;
    case 'receptor': return Activity;
    case 'dosing': return Pill;
    case 'side_effects': return AlertCircle;
    case 'clinical_pearl': return Lightbulb;
    default: return BookOpen;
  }
}

/**
 * Get label for question type
 */
function getTypeLabel(type) {
  switch (type) {
    case 'mechanism': return 'Mechanism';
    case 'receptor': return 'Receptors';
    case 'dosing': return 'Dosing';
    case 'side_effects': return 'Side Effects';
    case 'clinical_pearl': return 'Clinical Pearl';
    default: return 'Question';
  }
}

/**
 * Get color for question type
 */
function getTypeColor(type) {
  switch (type) {
    case 'mechanism': return 'bg-purple-100 text-purple-700';
    case 'receptor': return 'bg-blue-100 text-blue-700';
    case 'dosing': return 'bg-green-100 text-green-700';
    case 'side_effects': return 'bg-red-100 text-red-700';
    case 'clinical_pearl': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Main DrugFlashcard component
 */
export function DrugFlashcard({
  question,
  answer,
  type,
  medicationName,
  onCorrect,
  onIncorrect,
  onNext,
  showControls = true,
  className,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const TypeIcon = getTypeIcon(type);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = () => {
    setHasAnswered(true);
    onCorrect?.();
  };

  const handleIncorrect = () => {
    setHasAnswered(true);
    onIncorrect?.();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setHasAnswered(false);
    onNext?.();
  };

  return (
    <div className={cn('perspective-1000', className)}>
      <div
        className={cn(
          'relative w-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer',
          isFlipped && 'rotate-y-180'
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s',
        }}
        onClick={handleFlip}
      >
        {/* Front - Question */}
        <Card
          className={cn(
            'p-5 min-h-[200px] flex flex-col',
            'backface-hidden'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between mb-3">
            <Badge className={cn('text-xs', getTypeColor(type))}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {getTypeLabel(type)}
            </Badge>
            <span className="text-xs text-gray-400">Tap to flip</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              {medicationName}
            </h4>
            <p className="text-lg font-medium text-gray-900">{question}</p>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-gray-400">
              Think of your answer, then tap to reveal
            </span>
          </div>
        </Card>

        {/* Back - Answer */}
        <Card
          className={cn(
            'p-5 min-h-[200px] flex flex-col absolute inset-0',
            'backface-hidden bg-gradient-to-br from-green-50 to-emerald-50'
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <Badge className={cn('text-xs', getTypeColor(type))}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {getTypeLabel(type)}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              Answer
            </Badge>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              {medicationName}
            </h4>
            <p className="text-base text-gray-800 leading-relaxed">{answer}</p>
          </div>

          {showControls && !hasAnswered && (
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncorrect();
                }}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Missed it
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCorrect();
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Got it!
              </Button>
            </div>
          )}

          {showControls && hasAnswered && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Next Card
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DrugFlashcard;
