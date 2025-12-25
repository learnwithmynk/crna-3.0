/**
 * TrackerQuickActions - Quick prompts to log clinical hours, EQ reflections, etc.
 *
 * Provides fast access to common tracker actions without navigating to the full tracker page.
 *
 * Used in: DashboardPage sidebar
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Heart,
  Calendar,
  PenLine,
  Plus,
} from 'lucide-react';

const quickActions = [
  {
    id: 'clinical',
    label: 'Log Clinical Hours',
    icon: Stethoscope,
    href: '/trackers?tab=clinical&action=add',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 'eq',
    label: 'Add EQ Reflection',
    icon: Heart,
    href: '/trackers?tab=eq&action=add',
    color: 'text-pink-600 bg-pink-100',
  },
  {
    id: 'shadow',
    label: 'Log Shadow Day',
    icon: Calendar,
    href: '/trackers?tab=shadow&action=add',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    id: 'event',
    label: 'Log Event',
    icon: PenLine,
    href: '/trackers?tab=events&action=add',
    color: 'text-green-600 bg-green-100',
  },
];

export function TrackerQuickActions() {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="w-4 h-4" />
          Quick Log
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                asChild
                variant="outline"
                size="sm"
                className="h-auto py-3 flex flex-col items-center gap-1.5 hover:bg-gray-50"
              >
                <Link to={action.href}>
                  <div className={`p-1.5 rounded-xl ${action.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {action.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default TrackerQuickActions;
