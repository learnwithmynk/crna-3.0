/**
 * LessonContent Component
 *
 * Wrapper for rendering Editor.js lesson content with proper styling.
 * Adds section header and consistent layout.
 *
 * Used in: LessonPage
 */

import { EditorRenderer } from '@/components/features/lms/EditorRenderer';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {Object} props.content - Editor.js JSON data
 * @param {string} props.className - Additional classes
 */
export function LessonContent({ content, className }) {
  // Don't render if no content
  if (!content?.blocks?.length) {
    return null;
  }

  return (
    <section className={cn('', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          What You Need to Know
        </h2>
      </div>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <EditorRenderer data={content} />
      </div>
    </section>
  );
}

export default LessonContent;
