/**
 * ForumBreadcrumb Component
 *
 * Navigation breadcrumb for forum pages.
 * Shows: Forums > Forum Name > Topic Title
 */

import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ForumBreadcrumb({
  forum,
  topic,
  className
}) {
  const items = [
    { label: 'Community', href: '/community/forums', icon: Home },
  ];

  // Add forum if provided
  if (forum) {
    items.push({
      label: forum.title?.rendered || forum.name || 'Forum',
      href: `/community/forums/${forum.id}`,
    });
  }

  // Add topic if provided (no link - current page)
  if (topic) {
    items.push({
      label: topic.title?.rendered || 'Topic',
      href: null, // Current page, no link
    });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm', className)}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              )}

              {/* Link or text */}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="max-w-[150px] sm:max-w-[200px] truncate">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1 max-w-[150px] sm:max-w-[250px] truncate',
                    isLast ? 'text-gray-900 font-medium' : 'text-gray-500'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ForumBreadcrumb;
