/**
 * EQ Summary Card
 *
 * Displays EQ/Leadership reflection summary:
 * - Total reflections
 * - Categories covered (X/10)
 * - Coverage visualization
 * - Recent reflection titles
 * - Missing categories insight
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { EQ_CATEGORIES } from '@/data/mockEQReflections';

export function EQSummaryCard({
  reflections = [],
  onViewTracker,
}) {
  if (!reflections || reflections.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="w-4 h-4" />
            EQ & Leadership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <Brain className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No reflections logged yet</p>
            <p className="text-xs mt-1">Document leadership moments for interviews</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={onViewTracker}>
              Add Reflection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const categoriesUsed = new Set();
  reflections.forEach((r) => r.categories?.forEach((c) => categoriesUsed.add(c)));

  const totalCategories = EQ_CATEGORIES.length;
  const coveredCategories = categoriesUsed.size;
  const coveragePercent = Math.round((coveredCategories / totalCategories) * 100);

  // Find missing categories (common interview topics)
  const interviewFocusCategories = ['conflict_resolution', 'leadership', 'stress_management', 'empathy_compassion', 'ethics'];
  const missingImportant = interviewFocusCategories.filter(c => !categoriesUsed.has(c));

  // Get recent reflections
  const recentReflections = reflections
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Get covered category info
  const coveredCategoryInfo = EQ_CATEGORIES.filter(c => categoriesUsed.has(c.value));
  const missingCategoryInfo = EQ_CATEGORIES.filter(c => !categoriesUsed.has(c.value));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-4 h-4" />
          EQ & Leadership
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewTracker}>
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <FileText className="w-4 h-4 mx-auto text-gray-500 mb-1" />
            <p className="text-lg font-bold">{reflections.length}</p>
            <p className="text-xs text-gray-500">Reflections</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <Lightbulb className="w-4 h-4 mx-auto text-gray-500 mb-1" />
            <p className="text-lg font-bold">{coveredCategories}/{totalCategories}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>

        {/* Category Coverage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Category Coverage</span>
            <span className="font-medium">{coveragePercent}%</span>
          </div>
          <Progress value={coveragePercent} className="h-2" />
        </div>

        {/* Category Tags */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">Covered:</p>
          <div className="flex flex-wrap gap-1">
            {coveredCategoryInfo.map((cat) => (
              <Badge
                key={cat.value}
                variant="outline"
                className={`text-xs ${cat.color} border-transparent`}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Reflections */}
        {recentReflections.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-gray-500">Recent:</p>
            {recentReflections.map((reflection) => (
              <div key={reflection.id} className="text-sm text-gray-600 truncate">
                • {reflection.title}
              </div>
            ))}
          </div>
        )}

        {/* Missing Categories Insight */}
        {missingImportant.length > 0 ? (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Consider adding reflections for:</p>
              <p className="text-xs mt-0.5">
                {missingImportant.slice(0, 3).map(c => {
                  const cat = EQ_CATEGORIES.find(ec => ec.value === c);
                  return cat?.label || c;
                }).join(', ')}
              </p>
              <p className="text-xs mt-1 text-amber-600">(Common interview topics)</p>
            </div>
          </div>
        ) : coveragePercent >= 70 ? (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">
              Great coverage! You have strong interview material across key EQ areas.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default EQSummaryCard;
