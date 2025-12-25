/**
 * HtmlContent Component
 *
 * Safely renders HTML content from BuddyBoss API responses.
 * Uses DOMPurify to sanitize HTML and prevent XSS attacks.
 *
 * Usage:
 *   <HtmlContent html={topic.content.rendered} />
 *   <HtmlContent html={reply.content.rendered} className="prose" />
 */

import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

// Configure DOMPurify to allow safe tags for forum content
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'pre', 'code',
  'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr', 'span', 'div'
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'title',
  'class', 'id', 'style'
];

export function HtmlContent({
  html,
  className,
  as: Component = 'div',
  allowImages = true,
  ...props
}) {
  const sanitizedHtml = useMemo(() => {
    if (!html) return '';

    const config = {
      ALLOWED_TAGS: allowImages ? ALLOWED_TAGS : ALLOWED_TAGS.filter(t => t !== 'img'),
      ALLOWED_ATTR,
      // Force all links to open in new tab
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'],
    };

    // Sanitize the HTML
    let clean = DOMPurify.sanitize(html, config);

    // Add target="_blank" and rel="noopener noreferrer" to all links
    clean = clean.replace(
      /<a\s+([^>]*?)>/gi,
      (match, attrs) => {
        if (!attrs.includes('target=')) {
          return `<a ${attrs} target="_blank" rel="noopener noreferrer">`;
        }
        return match;
      }
    );

    return clean;
  }, [html, allowImages]);

  if (!sanitizedHtml) {
    return null;
  }

  return (
    <Component
      className={cn(
        // Base prose styles for forum content
        'prose prose-sm max-w-none',
        // Links
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        // Paragraphs
        'prose-p:my-2 prose-p:leading-relaxed',
        // Lists
        'prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5',
        // Blockquotes
        'prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:my-2',
        // Code
        'prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
        'prose-pre:bg-gray-900 prose-pre:text-gray-100',
        // Images
        'prose-img:rounded-xl prose-img:max-w-full',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      {...props}
    />
  );
}

export default HtmlContent;
