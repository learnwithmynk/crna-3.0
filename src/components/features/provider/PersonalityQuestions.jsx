/**
 * PersonalityQuestions Component
 *
 * KEY DIFFERENTIATOR: Fun personality questions help applicants find mentors they vibe with.
 * This is what sets us apart from competitors - mentorship matching based on personality fit,
 * not just credentials.
 *
 * Features:
 * - 10 optional personality questions (mix of text, dropdowns, radio)
 * - Character counters showing remaining chars
 * - Colorful card-based layout with emoji icons
 * - Progress tracking: "X/10 questions answered"
 * - Gamification: "Fill 5+ to unlock 'Personality Pro' badge!"
 */

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Star,
  Briefcase,
  Cat,
  Heart,
  Music,
  Lightbulb,
  Coffee,
  Mountain,
  Quote
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Question configurations with icons, labels, types, and character limits
const QUESTIONS = [
  {
    id: 'tagline',
    icon: Sparkles,
    label: 'If you knew me, you\'d know that...',
    type: 'text',
    maxLength: 100,
    color: 'purple',
    placeholder: 'I always have a coffee in hand'
  },
  {
    id: 'astrology',
    icon: Star,
    label: 'My astrological sign is...',
    type: 'select',
    color: 'pink',
    options: [
      { value: 'aries', label: 'Aries' },
      { value: 'taurus', label: 'Taurus' },
      { value: 'gemini', label: 'Gemini' },
      { value: 'cancer', label: 'Cancer' },
      { value: 'leo', label: 'Leo' },
      { value: 'virgo', label: 'Virgo' },
      { value: 'libra', label: 'Libra' },
      { value: 'scorpio', label: 'Scorpio' },
      { value: 'sagittarius', label: 'Sagittarius' },
      { value: 'capricorn', label: 'Capricorn' },
      { value: 'aquarius', label: 'Aquarius' },
      { value: 'pisces', label: 'Pisces' },
      { value: 'no-belief', label: 'I don\'t believe in that 😂' }
    ]
  },
  {
    id: 'icu_vibe',
    icon: Briefcase,
    label: 'My ICU vibe is...',
    type: 'select',
    color: 'blue',
    options: [
      { value: 'organized-chaos', label: 'Organized chaos' },
      { value: 'silent-efficiency', label: 'Silent efficiency' },
      { value: 'coffee-fueled', label: 'Coffee-fueled heroics' },
      { value: 'teaching', label: 'Teaching every moment' }
    ]
  },
  {
    id: 'pet_preference',
    icon: Cat,
    label: 'Cats or dogs?',
    type: 'radio',
    color: 'orange',
    options: [
      { value: 'cats', label: 'Cats 🐱' },
      { value: 'dogs', label: 'Dogs 🐕' },
      { value: 'both', label: 'Both!' },
      { value: 'neither', label: 'Neither' }
    ]
  },
  {
    id: 'patient_population',
    icon: Heart,
    label: 'My favorite patient population to care for is...',
    type: 'text',
    maxLength: 50,
    color: 'red',
    placeholder: 'Cardiac patients'
  },
  {
    id: 'music',
    icon: Music,
    label: 'If I drove you on a road trip, we\'d be listening to...',
    type: 'text',
    maxLength: 75,
    color: 'green',
    placeholder: '90s hip hop and true crime podcasts'
  },
  {
    id: 'weird_fact',
    icon: Lightbulb,
    label: 'A weird fact about me:',
    type: 'text',
    maxLength: 150,
    color: 'yellow',
    placeholder: 'I can recite all 50 states in alphabetical order'
  },
  {
    id: 'comfort_food',
    icon: Coffee,
    label: 'My comfort food is...',
    type: 'text',
    maxLength: 50,
    color: 'amber',
    placeholder: 'Pizza and ice cream'
  },
  {
    id: 'hobbies',
    icon: Mountain,
    label: 'When I\'m not studying, you\'ll find me...',
    type: 'text',
    maxLength: 100,
    color: 'teal',
    placeholder: 'Hiking or binge-watching reality TV'
  },
  {
    id: 'motto',
    icon: Quote,
    label: 'My motto/mantra is...',
    type: 'text',
    maxLength: 100,
    color: 'indigo',
    placeholder: 'Progress over perfection'
  }
];

// Color classes for each card
const COLOR_CLASSES = {
  purple: 'bg-purple-50 border-purple-200',
  pink: 'bg-pink-50 border-pink-200',
  blue: 'bg-blue-50 border-blue-200',
  orange: 'bg-orange-50 border-orange-200',
  red: 'bg-red-50 border-red-200',
  green: 'bg-green-50 border-green-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  amber: 'bg-amber-50 border-amber-200',
  teal: 'bg-teal-50 border-teal-200',
  indigo: 'bg-indigo-50 border-indigo-200'
};

const ICON_CLASSES = {
  purple: 'text-purple-600 bg-purple-100',
  pink: 'text-pink-600 bg-pink-100',
  blue: 'text-blue-600 bg-blue-100',
  orange: 'text-orange-600 bg-orange-100',
  red: 'text-red-600 bg-red-100',
  green: 'text-green-600 bg-green-100',
  yellow: 'text-yellow-600 bg-yellow-100',
  amber: 'text-amber-600 bg-amber-100',
  teal: 'text-teal-600 bg-teal-100',
  indigo: 'text-indigo-600 bg-indigo-100'
};

// Simple radio group component
function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

// Character counter helper
function CharacterCounter({ current, max, className }) {
  const remaining = max - (current || 0);
  const isNearLimit = remaining < 20;

  return (
    <div
      className={cn(
        'text-xs text-right',
        isNearLimit ? 'text-orange-600 font-medium' : 'text-gray-400',
        className
      )}
    >
      {remaining} characters remaining
    </div>
  );
}

// Individual question card
function QuestionCard({ question, value, onChange }) {
  const Icon = question.icon;
  const hasValue = value && value.length > 0;

  return (
    <Card className={cn('border-2 transition-all', COLOR_CLASSES[question.color])}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              ICON_CLASSES[question.color]
            )}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Question content */}
          <div className="flex-1 space-y-3">
            <Label className="text-base font-semibold text-gray-900">
              {question.label}
            </Label>

            {/* Text input */}
            {question.type === 'text' && (
              <div className="space-y-1">
                <Input
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={question.placeholder}
                  maxLength={question.maxLength}
                  className="bg-white"
                />
                <CharacterCounter
                  current={value?.length || 0}
                  max={question.maxLength}
                />
              </div>
            )}

            {/* Select dropdown */}
            {question.type === 'select' && (
              <Select value={value || ''} onValueChange={onChange}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Choose one..." />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Radio buttons */}
            {question.type === 'radio' && (
              <RadioGroup
                options={question.options}
                value={value || ''}
                onChange={onChange}
                name={question.id}
              />
            )}
          </div>

          {/* Checkmark indicator */}
          {hasValue && (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PersonalityQuestions({ value = {}, onChange, className }) {
  // Calculate progress
  const answeredCount = QUESTIONS.filter(
    (q) => value[q.id] && value[q.id].length > 0
  ).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);
  const hasPersonalityPro = answeredCount >= 5;

  // Handle individual question change
  const handleQuestionChange = (questionId, newValue) => {
    onChange?.({
      ...value,
      [questionId]: newValue
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with progress */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Show Your Personality
            </h3>
            <p className="text-sm text-gray-600">
              These fun questions help applicants find mentors they'll click with.
              All questions are optional!
            </p>
          </div>
          {hasPersonalityPro && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-300 shrink-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Personality Pro!
            </Badge>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              {answeredCount} of {QUESTIONS.length} questions answered
            </span>
            <span className="text-gray-500">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Personality Pro unlock hint */}
        {!hasPersonalityPro && (
          <p className="text-xs text-purple-600 mt-3">
            Fill out 5 or more questions to unlock the "Personality Pro" badge!
          </p>
        )}
      </div>

      {/* Question cards */}
      <div className="space-y-4">
        {QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            value={value[question.id]}
            onChange={(newValue) => handleQuestionChange(question.id, newValue)}
          />
        ))}
      </div>

      {/* Completion encouragement */}
      {answeredCount > 0 && answeredCount < QUESTIONS.length && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            <strong>Looking good!</strong> Each question you answer helps applicants
            feel more connected to you.
          </p>
        </div>
      )}

      {/* All done celebration */}
      {answeredCount === QUESTIONS.length && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm text-green-800 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <strong>Amazing!</strong> You've completed all personality questions.
            Applicants will love getting to know you!
          </p>
        </div>
      )}
    </div>
  );
}

export default PersonalityQuestions;
