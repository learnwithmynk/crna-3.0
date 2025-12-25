import { AlertCircle } from 'lucide-react';

/**
 * MentionWarning Component
 *
 * Displays inline warning for invalid @mentions in forum posts/replies.
 * Non-blocking - users can still post, but are warned about missing users.
 */
export function MentionWarning({ invalidMentions }) {
  if (!invalidMentions || invalidMentions.length === 0) return null;

  return (
    <div
      className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm"
      data-testid="mention-warning"
    >
      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="text-amber-900">
        <span className="font-medium">User not found: </span>
        {invalidMentions.map((username, index) => (
          <span key={username}>
            <span className="font-mono">@{username}</span>
            {index < invalidMentions.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
