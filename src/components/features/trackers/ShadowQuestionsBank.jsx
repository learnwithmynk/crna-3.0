/**
 * ShadowQuestionsBank Component
 *
 * Curated questions to ask during shadow days:
 * - Career questions
 * - Clinical questions
 * - Program-specific questions
 * - Networking questions
 * - LOR setup questions
 *
 * Features:
 * - Category filtering
 * - Save favorites
 * - Copy to notes
 * - Conditional questions (e.g., only show if CRNA is from target program)
 */

import { useState } from 'react';
import {
  MessageCircle,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Users,
  FileText,
  Copy,
  Star,
  StarOff,
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { QUESTIONS_TO_ASK } from '@/data/shadowDaysEnhanced';

// Category configuration
const CATEGORIES = [
  { id: 'all', label: 'All', icon: MessageCircle },
  { id: 'career', label: 'Career', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'clinical', label: 'Clinical', icon: Stethoscope },
  { id: 'program', label: 'Program', icon: GraduationCap },
  { id: 'networking', label: 'Networking', icon: Users },
  { id: 'lor', label: 'LOR', icon: FileText },
];

/**
 * Single question card
 */
function QuestionCard({
  question,
  isFavorite,
  onToggleFavorite,
  onCopy,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(question.question);
    setCopied(true);
    onCopy?.(question);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-white border rounded-xl hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium leading-relaxed">
            "{question.question}"
          </p>
          {question.why && (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 flex-shrink-0" />
              {question.why}
            </p>
          )}
          {question.conditional && (
            <Badge variant="outline" className="mt-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
              Ask if relevant
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(question.id)}
            className={cn(
              'h-8 w-8',
              isFavorite ? 'text-yellow-500' : 'text-gray-400'
            )}
          >
            {isFavorite ? (
              <Star className="w-4 h-4 fill-current" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main ShadowQuestionsBank component
 *
 * @param {boolean} collapsed - If true, starts collapsed (default false)
 * @param {number} limit - Max questions to show when expanded (default all)
 * @param {boolean} hasTargetProgramCRNA - Show program-specific questions
 */
export function ShadowQuestionsBank({
  hasTargetProgramCRNA = false,
  collapsed = false,
  limit,
  className,
}) {
  const [expanded, setExpanded] = useState(!collapsed);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  // Filter questions based on category and conditions
  const filteredQuestions = QUESTIONS_TO_ASK.filter((q) => {
    // Category filter
    if (activeCategory !== 'all' && q.category !== activeCategory) {
      return false;
    }
    // Hide program questions if CRNA isn't from target program
    if (q.category === 'program' && q.conditional && !hasTargetProgramCRNA) {
      return false;
    }
    return true;
  });

  // Get favorite questions
  const favoriteQuestions = QUESTIONS_TO_ASK.filter((q) =>
    favorites.includes(q.id)
  );

  const handleToggleFavorite = (questionId) => {
    setFavorites((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <Card className={cn('p-4', className)}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Questions to Ask</h3>
          <Badge variant="outline" className="text-xs">
            {QUESTIONS_TO_ASK.length} questions
          </Badge>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Preview when collapsed */}
      {!expanded && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            Thoughtful questions to ask during your shadow day. Tap to expand.
          </p>
          {favorites.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              {favorites.length} saved {favorites.length === 1 ? 'question' : 'questions'}
            </div>
          )}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? QUESTIONS_TO_ASK.length
                  : QUESTIONS_TO_ASK.filter((q) => q.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Favorites section */}
          {favorites.length > 0 && activeCategory === 'all' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-700">
                <Star className="w-4 h-4 fill-current" />
                Your Saved Questions
              </div>
              <div className="space-y-2 pl-2 border-l-2 border-yellow-200">
                {favoriteQuestions.slice(0, 3).map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-2">
            {activeCategory !== 'all' && (
              <p className="text-sm text-gray-500">
                {filteredQuestions.length}{' '}
                {filteredQuestions.length === 1 ? 'question' : 'questions'} in this
                category
              </p>
            )}
            {(limit ? filteredQuestions.slice(0, limit) : filteredQuestions).map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                isFavorite={favorites.includes(question.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
            {limit && filteredQuestions.length > limit && (
              <p className="text-xs text-gray-400 text-center pt-2">
                +{filteredQuestions.length - limit} more questions
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
            <p className="font-medium mb-1">Pro tip:</p>
            <p>
              Don't ask all these questions! Pick 5-8 that feel natural. Let the
              conversation flow and ask follow-up questions based on their answers.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ShadowQuestionsBank;
