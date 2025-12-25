/**
 * SchoolFastFacts Component
 *
 * Quick stats grid showing key school metrics.
 * Displays tuition, length, class size, pass rates, etc.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  Calendar,
  Users,
  GraduationCap,
  Clock,
  TrendingUp,
  Award,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SchoolFastFacts({ school }) {
  if (!school) return null;

  const {
    tuitionInState,
    tuitionOutOfState,
    lengthMonths,
    classSize,
    ncePassRate,
    attritionRate,
    startDates,
    accreditation,
    rankingTier,
  } = school;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format start dates
  const formatStartDates = (dates) => {
    if (!dates || dates.length === 0) return 'Contact school';
    return dates.join(', ');
  };

  const facts = [
    {
      label: 'In-State Tuition',
      value: formatCurrency(tuitionInState),
      icon: DollarSign,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'Out-of-State Tuition',
      value: formatCurrency(tuitionOutOfState),
      icon: DollarSign,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'Program Length',
      value: lengthMonths ? `${lengthMonths} months` : 'N/A',
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'Class Size',
      value: classSize ? `${classSize} students` : 'N/A',
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'NCE Pass Rate',
      value: ncePassRate ? `${ncePassRate}%` : 'N/A',
      icon: Award,
      color: ncePassRate >= 90 ? 'text-green-600' : 'text-gray-600',
      bgColor: ncePassRate >= 90 ? 'bg-green-50' : 'bg-gray-50',
      highlight: ncePassRate >= 95,
    },
    {
      label: 'Attrition Rate',
      value: attritionRate !== null && attritionRate !== undefined
        ? `${attritionRate}%`
        : 'N/A',
      icon: TrendingUp,
      color: attritionRate !== null && attritionRate <= 5 ? 'text-green-600' : 'text-gray-600',
      bgColor: attritionRate !== null && attritionRate <= 5 ? 'bg-green-50' : 'bg-gray-50',
    },
    {
      label: 'Start Dates',
      value: formatStartDates(startDates),
      icon: Calendar,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'Accreditation',
      value: accreditation || 'COA Accredited',
      icon: Building2,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Quick Facts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className={cn(
                "p-3 rounded-xl",
                fact.bgColor
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <fact.icon className={cn("w-4 h-4", fact.color)} />
                <span className="text-xs text-gray-600">{fact.label}</span>
              </div>
              <div className={cn(
                "font-semibold",
                fact.highlight && "text-green-700"
              )}>
                {fact.value}
                {fact.highlight && (
                  <span className="ml-1 text-xs text-green-600">★</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ranking Badge if available */}
        {rankingTier && (
          <div className="mt-4 p-3 bg-linear-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">
                {rankingTier === 'top_10' && 'Top 10 Program'}
                {rankingTier === 'top_25' && 'Top 25 Program'}
                {rankingTier === 'top_50' && 'Top 50 Program'}
                {!['top_10', 'top_25', 'top_50'].includes(rankingTier) && rankingTier}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SchoolFastFacts;
