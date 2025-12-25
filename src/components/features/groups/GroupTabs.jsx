/**
 * GroupTabs Component
 *
 * Tab navigation for group detail page.
 * Switches between Activity, Members, and About sections.
 */

import { MessageSquare, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'activity', label: 'Activity', icon: MessageSquare },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'about', label: 'About', icon: Info },
];

export function GroupTabs({
  activeTab = 'activity',
  onTabChange,
  activityCount,
  memberCount,
  className
}) {
  return (
    <div className={cn('border-b border-gray-200', className)} role="tablist" aria-label="Group sections">
      <div className="flex gap-1 -mb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // Get count for tab
          let count = null;
          if (tab.id === 'activity' && activityCount > 0) {
            count = activityCount;
          } else if (tab.id === 'members' && memberCount > 0) {
            count = memberCount;
          }

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {count !== null && (
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-500'
                )}>
                  {count > 999 ? '999+' : count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GroupTabs;
