/**
 * ForumCard Component
 *
 * Clickable card displaying a forum with topic/reply counts.
 * Links to the forum detail page.
 */

import { Link } from 'react-router-dom';
import { MessageSquare, MessagesSquare, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RelativeTime } from '@/components/ui/relative-time';
import { cn } from '@/lib/utils';

export function ForumCard({ forum, className }) {
  const {
    id,
    title,
    content,
    topic_count,
    reply_count,
    last_active,
    sub_forums
  } = forum;

  const hasSubforums = sub_forums && sub_forums.length > 0;

  return (
    <Link to={`/community/forums/${id}`} className="block">
      <Card
        className={cn(
          'p-6 md:p-8 hover:shadow-md transition-all cursor-pointer rounded-3xl',
          'border border-gray-100 hover:border-orange-200 bg-white',
          className
        )}
      >
        <div className="flex items-start gap-5">
          {/* Forum icon */}
          <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 py-1">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-lg">
              {title.rendered}
            </h3>

            {/* Description */}
            {content?.rendered && (
              <p
                className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: content.rendered.replace(/<[^>]*>/g, '')
                }}
              />
            )}

            {/* Subforums preview */}
            {hasSubforums && (
              <div className="mt-4 flex flex-wrap gap-2">
                {sub_forums.slice(0, 4).map((sf) => (
                  <span
                    key={sf.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-gray-50 text-gray-600 border border-gray-100"
                  >
                    {sf.title.rendered}
                  </span>
                ))}
                {sub_forums.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-gray-50 text-gray-500 border border-gray-100">
                    +{sub_forums.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="hidden sm:flex flex-col items-end gap-2 text-sm text-gray-500 shrink-0 py-1">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span>{topic_count.toLocaleString()} topics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessagesSquare className="w-4 h-4 text-gray-400" />
              <span>{reply_count.toLocaleString()} replies</span>
            </div>
            {last_active && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <RelativeTime date={last_active} className="text-xs" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile stats */}
        <div className="flex sm:hidden items-center gap-4 mt-5 pt-5 border-t border-gray-100 text-xs text-gray-500">
          <span>{topic_count.toLocaleString()} topics</span>
          <span>{reply_count.toLocaleString()} replies</span>
          {last_active && (
            <RelativeTime date={last_active} className="text-xs ml-auto" />
          )}
        </div>
      </Card>
    </Link>
  );
}

export default ForumCard;
