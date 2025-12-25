/**
 * EmptyState component for The CRNA Club
 * Used when a section has no data to display
 *
 * Supports multiple API patterns:
 * - icon: Can be a component reference (e.g., Heart) or JSX element (e.g., <Heart />)
 * - action: Can be JSX element, object { label, onClick }, or use actionLabel/onAction/actionHref
 */

import { isValidElement } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  action,
  className,
}) {
  // Render icon - supports both component reference and JSX element
  const renderIcon = () => {
    if (!Icon) return null;

    // If it's already a JSX element, render it directly
    if (isValidElement(Icon)) {
      return <div className="mx-auto mb-4">{Icon}</div>;
    }

    // Otherwise treat as component reference
    return (
      <div className="mx-auto w-12 h-12 text-gray-300 mb-4">
        <Icon className="w-full h-full" />
      </div>
    );
  };

  // Render action - supports JSX, object { label, onClick }, or actionLabel/onAction/actionHref
  const renderAction = () => {
    // If action prop is JSX element, render directly
    if (action && isValidElement(action)) {
      return action;
    }

    // If action prop is object with label/onClick
    if (action && typeof action === 'object' && action.label) {
      return (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      );
    }

    // Fall back to actionLabel/actionHref/onAction pattern
    if (actionLabel && (actionHref || onAction)) {
      return actionHref ? (
        <Button asChild>
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      ) : (
        <Button onClick={onAction}>{actionLabel}</Button>
      );
    }

    return null;
  };

  return (
    <div className={cn('text-center py-12 px-4', className)}>
      {renderIcon()}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {renderAction()}
    </div>
  );
}
