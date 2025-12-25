/**
 * Editor.js Configuration
 *
 * Configures all available block tools for the lesson editor.
 * Used by BlockEditor component for admin lesson editing.
 */

import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';

// Custom tools
import CalloutTool from '@/components/features/editor/tools/CalloutTool';
import LinkCardTool from '@/components/features/editor/tools/LinkCardTool';
import DownloadTool from '@/components/features/editor/tools/DownloadTool';

import { createEditorImageUploader } from '@/hooks/useImageUpload';

/**
 * Editor.js tools configuration
 * @param {Object} options - Configuration options
 * @param {Function} options.onImageUpload - Custom image upload handler (optional)
 */
export function getEditorTools(options = {}) {
  const imageUploader = createEditorImageUploader();

  return {
    header: {
      class: Header,
      config: {
        levels: [1, 2, 3],
        defaultLevel: 2,
      },
      inlineToolbar: true,
    },
    list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
    },
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    image: {
      class: Image,
      config: {
        uploader: options.onImageUpload || imageUploader,
        captionPlaceholder: 'Enter image caption',
        buttonContent: 'Select an image',
      },
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote author',
      },
    },
    delimiter: Delimiter,
    embed: {
      class: Embed,
      config: {
        services: {
          vimeo: true,
          youtube: true,
        },
      },
    },
    inlineCode: {
      class: InlineCode,
    },
    marker: {
      class: Marker,
    },
    // Custom tools
    callout: {
      class: CalloutTool,
    },
    linkCard: {
      class: LinkCardTool,
    },
    download: {
      class: DownloadTool,
      config: {
        downloads: options.downloads || [],
      },
    },
  };
}

/**
 * Default Editor.js tools (without custom uploader)
 */
export const EDITOR_TOOLS = getEditorTools();

/**
 * Editor.js default configuration
 */
export const EDITOR_CONFIG = {
  placeholder: 'Start writing your lesson content...',
  autofocus: false,
  minHeight: 200,
};

/**
 * Supported block types for reference
 */
export const BLOCK_TYPES = {
  header: 'Header',
  paragraph: 'Paragraph',
  list: 'List',
  checklist: 'Checklist',
  table: 'Table',
  image: 'Image',
  quote: 'Quote',
  delimiter: 'Divider',
  embed: 'Embed (Video)',
  // Custom blocks
  callout: 'Callout',
  linkCard: 'Link Card',
  download: 'Download',
};

export default EDITOR_TOOLS;
