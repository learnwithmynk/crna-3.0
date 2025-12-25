/**
 * Text Parsing Utilities
 *
 * Unified parsing functions extracted from Section components.
 * Supports multiple parsing modes to maintain backward compatibility.
 */

/**
 * Parse text content into structured entries.
 *
 * @param {string|array} content - The content to parse
 * @param {object} options - Parsing options
 * @param {number} options.minLength - Minimum entry length (default: 0)
 * @param {boolean} options.parseTitleDescription - Parse "Title: Description" format (default: false)
 * @param {number} options.colonThreshold - Max position for colon to be treated as separator (default: 50)
 * @param {boolean} options.addIds - Add id field to each entry (default: false)
 * @param {boolean} options.splitOnSentences - Also split on ". " (default: false)
 * @returns {array} Parsed entries (strings or objects depending on options)
 */
export function parseEntries(content, options = {}) {
  const {
    minLength = 0,
    parseTitleDescription = false,
    colonThreshold = 50,
    addIds = false,
    splitOnSentences = false,
  } = options;

  // Handle null/undefined/empty
  if (!content) return [];

  // Pass through arrays unchanged
  if (Array.isArray(content)) return content;

  // Split content into lines
  let lines;
  if (splitOnSentences) {
    // Split on newlines OR sentence endings (period followed by space)
    lines = content.split(/[\n]|(?<=\.)\s+/);
  } else {
    lines = content.split(/\n/);
  }

  // Clean and filter lines
  lines = lines.map((s) => s.trim()).filter((s) => s.length > minLength);

  // If not parsing title/description, return strings
  if (!parseTitleDescription) {
    return lines;
  }

  // Parse "Title: Description" format
  return lines.map((s, index) => {
    const colonIndex = s.indexOf(':');
    const base = { title: s, description: '' };

    if (colonIndex > 0 && colonIndex < colonThreshold) {
      base.title = s.slice(0, colonIndex).trim();
      base.description = s.slice(colonIndex + 1).trim();
    }

    if (addIds) {
      base.id = `entry-${index}`;
    }

    return base;
  });
}

/**
 * Convert entries array back to string format.
 * Used for saving edited entries back to storage.
 *
 * @param {array} entries - Array of { title, description } objects
 * @returns {string} Formatted string with "Title: Description" on each line
 */
export function entriesToString(entries) {
  if (!entries || !Array.isArray(entries)) return '';

  return entries
    .filter((e) => e.title?.trim())
    .map((e) => (e.description ? `${e.title}: ${e.description}` : e.title))
    .join('\n');
}

// ============================================================================
// Backward-compatible aliases for gradual migration (Strangler Fig pattern)
// These match the exact behavior of the original implementations
// ============================================================================

/**
 * Leadership-style parsing (colonIndex < 50)
 * Used in: LeadershipSection.jsx
 */
export function parseEntriesWithTitleDescription(content) {
  return parseEntries(content, {
    parseTitleDescription: true,
    colonThreshold: 50,
  });
}

/**
 * Research-style parsing (minLength 10, split on sentences)
 * Used in: ResearchSection.jsx, CommunityInvolvementSection.jsx
 */
export function parseEntriesAsStrings(content, minLength = 10) {
  return parseEntries(content, {
    minLength,
    splitOnSentences: true,
  });
}

/**
 * Booster-style parsing (colonIndex < 60, with ids)
 * Used in: ResumeBoosterEditSheet.jsx
 */
export function parseEntriesWithIds(content) {
  return parseEntries(content, {
    parseTitleDescription: true,
    colonThreshold: 60,
    addIds: true,
  });
}
