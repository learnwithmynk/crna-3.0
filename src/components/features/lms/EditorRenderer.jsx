/**
 * EditorRenderer Component
 *
 * Renders Editor.js JSON content as React components.
 * Used to display saved lesson content to users.
 *
 * Supports all standard Editor.js blocks plus custom blocks.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Circle,
  AlertCircle,
  Lightbulb,
  Info,
  Download,
  Home,
  GraduationCap,
  Target,
  BarChart3,
  User,
  BookOpen,
  Wrench,
  CheckSquare,
  Users,
  Calendar,
  LinkIcon,
} from 'lucide-react';

/**
 * Render HTML content safely (for inline styles like bold, italic, links)
 * Uses DOMPurify to sanitize HTML and prevent XSS attacks
 */
function renderHTML(html) {
  if (!html) return null;
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code', 'mark', 'u', 's', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
  return <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

/**
 * Header Block
 */
function HeaderBlock({ data }) {
  const Tag = `h${data.level || 2}`;
  const styles = {
    1: 'text-3xl font-bold mt-8 mb-4',
    2: 'text-2xl font-bold mt-6 mb-3',
    3: 'text-xl font-semibold mt-4 mb-2',
  };

  return (
    <Tag className={styles[data.level] || styles[2]}>
      {renderHTML(data.text)}
    </Tag>
  );
}

/**
 * Paragraph Block
 */
function ParagraphBlock({ data }) {
  return (
    <p className="mb-4 leading-relaxed">
      {renderHTML(data.text)}
    </p>
  );
}

/**
 * List Block (ordered/unordered)
 */
function ListBlock({ data }) {
  const Tag = data.style === 'ordered' ? 'ol' : 'ul';
  const listStyles = data.style === 'ordered'
    ? 'list-decimal ml-6 mb-4 space-y-1'
    : 'list-disc ml-6 mb-4 space-y-1';

  return (
    <Tag className={listStyles}>
      {data.items?.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {renderHTML(item)}
        </li>
      ))}
    </Tag>
  );
}

/**
 * Checklist Block
 */
function ChecklistBlock({ data }) {
  return (
    <div className="mb-4 space-y-2">
      {data.items?.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {item.checked ? (
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
          )}
          <span className={cn(item.checked && 'text-gray-500 line-through')}>
            {renderHTML(item.text)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Table Block
 */
function TableBlock({ data }) {
  const hasHeadings = data.withHeadings;
  const content = data.content || [];

  return (
    <div className="mb-4 overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
        <tbody>
          {content.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                rowIndex === 0 && hasHeadings && 'bg-gray-50 font-semibold',
                rowIndex % 2 === 1 && !hasHeadings && 'bg-gray-50'
              )}
            >
              {row.map((cell, cellIndex) => {
                const CellTag = rowIndex === 0 && hasHeadings ? 'th' : 'td';
                return (
                  <CellTag
                    key={cellIndex}
                    className="border border-gray-200 px-4 py-2 text-left"
                  >
                    {renderHTML(cell)}
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Image Block
 */
function ImageBlock({ data }) {
  const { file, caption, withBorder, withBackground, stretched } = data;

  return (
    <figure
      className={cn(
        'mb-4',
        stretched && 'w-full',
        withBackground && 'bg-gray-100 p-4 rounded-xl'
      )}
    >
      <img
        src={file?.url || data.url}
        alt={caption || ''}
        className={cn(
          'max-w-full h-auto rounded-xl mx-auto',
          withBorder && 'border-2 border-gray-200',
          stretched && 'w-full'
        )}
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Quote Block
 */
function QuoteBlock({ data }) {
  return (
    <blockquote className="mb-4 pl-4 border-l-4 border-yellow-400 bg-yellow-50 py-3 pr-4 rounded-r-lg">
      <p className="text-gray-800 italic mb-2">
        {renderHTML(data.text)}
      </p>
      {data.caption && (
        <cite className="text-sm text-gray-600 not-italic">
          — {data.caption}
        </cite>
      )}
    </blockquote>
  );
}

/**
 * Delimiter Block
 */
function DelimiterBlock() {
  return (
    <div className="flex justify-center my-8">
      <div className="flex gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-300" />
        <span className="w-2 h-2 rounded-full bg-gray-300" />
        <span className="w-2 h-2 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

/**
 * Embed Block (Vimeo/YouTube)
 */
function EmbedBlock({ data }) {
  const { service, embed, caption } = data;

  return (
    <figure className="mb-4">
      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
        <iframe
          src={embed}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={caption || `${service} video`}
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Code Block (inline code is handled via HTML)
 */
function CodeBlock({ data }) {
  return (
    <pre className="mb-4 bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto">
      <code className="text-sm font-mono">{data.code}</code>
    </pre>
  );
}

/**
 * Callout Block (custom)
 */
function CalloutBlock({ data }) {
  const types = {
    info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    warning: { icon: AlertCircle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    tip: { icon: Lightbulb, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    important: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  };

  const style = types[data.type] || types.info;
  const Icon = style.icon;

  return (
    <div className={cn('mb-4 p-4 rounded-xl border', style.bg, style.border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', style.text)} />
        <div className={style.text}>
          {data.title && <strong className="block mb-1">{data.title}</strong>}
          {renderHTML(data.text)}
        </div>
      </div>
    </div>
  );
}

/**
 * LinkCard Block (custom)
 */
function LinkCardBlock({ data }) {
  const iconMap = {
    home: Home,
    school: GraduationCap,
    target: Target,
    chart: BarChart3,
    user: User,
    book: BookOpen,
    tool: Wrench,
    checklist: CheckSquare,
    users: Users,
    calendar: Calendar,
    link: LinkIcon,
  };

  const Icon = iconMap[data.icon] || LinkIcon;

  return (
    <Link
      to={data.path}
      className="mb-4 flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900">{data.title}</div>
        <div className="text-sm text-gray-500">{data.description}</div>
      </div>
      <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
        →
      </div>
    </Link>
  );
}

/**
 * Download Block (custom)
 */
function DownloadBlock({ data }) {
  const fileIcons = {
    pdf: '📄',
    xlsx: '📊',
    xls: '📊',
    doc: '📝',
    docx: '📝',
    zip: '🗜️',
    mp4: '🎬',
    mp3: '🎵',
    png: '🖼️',
    jpg: '🖼️',
    jpeg: '🖼️',
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const fileIcon = fileIcons[data.fileType?.toLowerCase()] || '📁';

  return (
    <div className="mb-4 flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white">
      <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">
        {fileIcon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900">{data.title}</div>
        {data.description && (
          <div className="text-sm text-gray-500 mt-0.5">{data.description}</div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {data.fileType?.toUpperCase() || 'File'}
          {data.fileSize && ` • ${formatFileSize(data.fileSize)}`}
        </div>
      </div>
      <a
        href={data.fileUrl}
        download
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f6ff88] text-gray-900 font-medium text-sm hover:bg-[#e5ee77] transition-colors shrink-0"
      >
        <Download className="w-4 h-4" />
        Download
      </a>
    </div>
  );
}

/**
 * Block type to component mapping
 */
const BLOCK_RENDERERS = {
  header: HeaderBlock,
  paragraph: ParagraphBlock,
  list: ListBlock,
  checklist: ChecklistBlock,
  table: TableBlock,
  image: ImageBlock,
  quote: QuoteBlock,
  delimiter: DelimiterBlock,
  embed: EmbedBlock,
  code: CodeBlock,
  callout: CalloutBlock,
  linkCard: LinkCardBlock,
  download: DownloadBlock,
};

/**
 * EditorRenderer Component
 *
 * @param {Object} props
 * @param {Object} props.data - Editor.js JSON data
 * @param {string} props.className - Additional CSS classes
 */
export function EditorRenderer({ data, className }) {
  if (!data?.blocks?.length) {
    return null;
  }

  return (
    <div className={cn('editor-content', className)}>
      {data.blocks.map((block, index) => {
        const Renderer = BLOCK_RENDERERS[block.type];

        if (!Renderer) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }

        return <Renderer key={block.id || index} data={block.data} />;
      })}
    </div>
  );
}

export default EditorRenderer;
