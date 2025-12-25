/**
 * Page layout components for The CRNA Club
 * PageWrapper provides consistent page structure with optional breadcrumbs and theming
 * PageHeader provides consistent page titles
 */

import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * Breadcrumb component for navigation
 * @param {Array} items - Array of { label, href } objects
 */
export function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      <Link
        to="/"
        className="hover:text-gray-700 transition-colors flex items-center"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * PageWrapper with optional theme support
 * @param {string} theme - Theme name (coral, purple, teal, emerald, amber, blue, rose)
 */
export function PageWrapper({ className, children, breadcrumbs, title, description, theme }) {
  const content = (
    <div className={cn('p-4 md:px-10 md:py-6 lg:px-14 pb-24 lg:pb-6', className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );

  // If theme is specified, wrap in ThemeProvider to override the app-level theme
  if (theme) {
    return (
      <ThemeProvider theme={theme}>
        {content}
      </ThemeProvider>
    );
  }

  return content;
}

export function PageHeader({ title, description, action, className }) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
