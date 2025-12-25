/**
 * Characterization Tests for parseEntries
 *
 * These tests document the CURRENT behavior of parseEntries functions
 * found across multiple components. They serve as a safety net before refactoring.
 *
 * Variants found in:
 * 1. LeadershipSection.jsx - parses "Title: Description" format, colonIndex < 50
 * 2. ResearchSection.jsx - splits on newlines OR sentence endings, minLength 10
 * 3. CommunityInvolvementSection.jsx - same as ResearchSection
 * 4. ResumeBoosterEditSheet.jsx - parses "Title: Description", colonIndex < 60, adds ids
 * 5. ResearchCommunitySection.jsx - needs to be checked
 */

import { describe, it, expect } from 'vitest';
import {
  parseEntries,
  entriesToString,
  parseEntriesWithTitleDescription,
  parseEntriesAsStrings,
  parseEntriesWithIds,
} from './textParsers';

// ============================================================================
// STEP 1: Extract current implementations as-is for characterization
// ============================================================================

// From LeadershipSection.jsx (colonIndex < 50)
function parseEntriesLeadership(content) {
  if (!content) return [];
  return content
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      const colonIndex = s.indexOf(':');
      if (colonIndex > 0 && colonIndex < 50) {
        return {
          title: s.slice(0, colonIndex).trim(),
          description: s.slice(colonIndex + 1).trim(),
        };
      }
      return { title: s, description: '' };
    });
}

// From ResearchSection.jsx / CommunityInvolvementSection.jsx (minLength 10)
function parseEntriesResearch(content) {
  if (!content) return [];
  return content
    .split(/[\n]|(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

// From ResumeBoosterEditSheet.jsx (colonIndex < 60, with ids)
function parseEntriesBooster(content) {
  if (!content) return [];
  if (Array.isArray(content)) return content;

  return content
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s, index) => {
      const colonIndex = s.indexOf(':');
      if (colonIndex > 0 && colonIndex < 60) {
        return {
          id: `entry-${index}`,
          title: s.slice(0, colonIndex).trim(),
          description: s.slice(colonIndex + 1).trim(),
        };
      }
      return { id: `entry-${index}`, title: s, description: '' };
    });
}

// ============================================================================
// CHARACTERIZATION TESTS - Document current behavior
// ============================================================================

describe('parseEntriesLeadership (LeadershipSection)', () => {
  it('returns empty array for null/undefined', () => {
    expect(parseEntriesLeadership(null)).toEqual([]);
    expect(parseEntriesLeadership(undefined)).toEqual([]);
    expect(parseEntriesLeadership('')).toEqual([]);
  });

  it('parses single line without colon', () => {
    expect(parseEntriesLeadership('Charge Nurse')).toEqual([
      { title: 'Charge Nurse', description: '' }
    ]);
  });

  it('parses single line with colon as title:description', () => {
    expect(parseEntriesLeadership('Charge Nurse: Led team of 8 nurses')).toEqual([
      { title: 'Charge Nurse', description: 'Led team of 8 nurses' }
    ]);
  });

  it('parses multiple lines', () => {
    const input = `Charge Nurse: Led team of 8 nurses
Preceptor: Trained 5 new grads`;
    expect(parseEntriesLeadership(input)).toEqual([
      { title: 'Charge Nurse', description: 'Led team of 8 nurses' },
      { title: 'Preceptor', description: 'Trained 5 new grads' }
    ]);
  });

  it('ignores empty lines', () => {
    const input = `Charge Nurse

Preceptor`;
    expect(parseEntriesLeadership(input)).toEqual([
      { title: 'Charge Nurse', description: '' },
      { title: 'Preceptor', description: '' }
    ]);
  });

  it('treats long prefix (>50 chars) as title without description', () => {
    const longTitle = 'A'.repeat(51) + ': description';
    const result = parseEntriesLeadership(longTitle);
    // colonIndex is 51, which is NOT < 50, so entire string becomes title
    expect(result[0].title).toBe(longTitle);
    expect(result[0].description).toBe('');
  });

  it('handles colon at edge of limit (colonIndex = 49)', () => {
    const title49 = 'A'.repeat(49);
    const input = `${title49}: description`;
    const result = parseEntriesLeadership(input);
    expect(result[0].title).toBe(title49);
    expect(result[0].description).toBe('description');
  });
});

describe('parseEntriesResearch (ResearchSection, CommunityInvolvementSection)', () => {
  it('returns empty array for null/undefined', () => {
    expect(parseEntriesResearch(null)).toEqual([]);
    expect(parseEntriesResearch(undefined)).toEqual([]);
    expect(parseEntriesResearch('')).toEqual([]);
  });

  it('filters out entries <= 10 characters', () => {
    expect(parseEntriesResearch('Short')).toEqual([]);
    expect(parseEntriesResearch('Exactly 10')).toEqual([]); // length is 10, needs > 10
    expect(parseEntriesResearch('Exactly 11c')).toEqual(['Exactly 11c']); // length is 11
  });

  it('splits on newlines', () => {
    const input = `First research project here
Second research project here`;
    expect(parseEntriesResearch(input)).toEqual([
      'First research project here',
      'Second research project here'
    ]);
  });

  it('splits on sentence endings (period followed by space)', () => {
    const input = 'First project here. Second project here.';
    expect(parseEntriesResearch(input)).toEqual([
      'First project here.',
      'Second project here.'
    ]);
  });

  it('returns strings, not objects', () => {
    const result = parseEntriesResearch('This is a research project');
    expect(typeof result[0]).toBe('string');
  });
});

describe('parseEntriesBooster (ResumeBoosterEditSheet)', () => {
  it('returns empty array for null/undefined', () => {
    expect(parseEntriesBooster(null)).toEqual([]);
    expect(parseEntriesBooster(undefined)).toEqual([]);
    expect(parseEntriesBooster('')).toEqual([]);
  });

  it('returns array input unchanged', () => {
    const input = [{ id: '1', title: 'Test', description: 'Desc' }];
    expect(parseEntriesBooster(input)).toBe(input); // Same reference
  });

  it('adds id field to each entry', () => {
    const result = parseEntriesBooster('Title: Description');
    expect(result[0].id).toBe('entry-0');
  });

  it('uses colonIndex < 60 threshold', () => {
    const title59 = 'A'.repeat(59);
    const input = `${title59}: description`;
    const result = parseEntriesBooster(input);
    expect(result[0].title).toBe(title59);
    expect(result[0].description).toBe('description');

    const title60 = 'A'.repeat(60);
    const input60 = `${title60}: description`;
    const result60 = parseEntriesBooster(input60);
    // colonIndex is 60, which is NOT < 60, so entire string becomes title
    expect(result60[0].title).toBe(input60);
    expect(result60[0].description).toBe('');
  });

  it('generates sequential ids for multiple entries', () => {
    const input = `First: desc1
Second: desc2`;
    const result = parseEntriesBooster(input);
    expect(result[0].id).toBe('entry-0');
    expect(result[1].id).toBe('entry-1');
  });
});

// ============================================================================
// Additional edge cases discovered during analysis
// ============================================================================

describe('Edge cases for all variants', () => {
  it('Leadership: handles whitespace around colon', () => {
    const result = parseEntriesLeadership('Title  :  Description with spaces  ');
    expect(result[0].title).toBe('Title');
    expect(result[0].description).toBe('Description with spaces');
  });

  it('Leadership: handles multiple colons - uses first one', () => {
    const result = parseEntriesLeadership('Title: Part 1: Part 2');
    expect(result[0].title).toBe('Title');
    expect(result[0].description).toBe('Part 1: Part 2');
  });

  it('Research: handles period at end of line', () => {
    const result = parseEntriesResearch('Research project.');
    expect(result).toEqual(['Research project.']);
  });

  it('Booster: handles carriage return + newline', () => {
    const input = 'First: desc1\r\nSecond: desc2';
    const result = parseEntriesBooster(input);
    // \r\n splits on \n, leaving \r in the string which gets trimmed
    expect(result.length).toBe(2);
  });
});

// ============================================================================
// STEP 2: Verify new unified implementation matches original behavior
// ============================================================================

describe('NEW: parseEntriesWithTitleDescription (replaces LeadershipSection)', () => {
  it('matches original for null/undefined', () => {
    expect(parseEntriesWithTitleDescription(null)).toEqual(parseEntriesLeadership(null));
    expect(parseEntriesWithTitleDescription(undefined)).toEqual(parseEntriesLeadership(undefined));
    expect(parseEntriesWithTitleDescription('')).toEqual(parseEntriesLeadership(''));
  });

  it('matches original for single line without colon', () => {
    const input = 'Charge Nurse';
    expect(parseEntriesWithTitleDescription(input)).toEqual(parseEntriesLeadership(input));
  });

  it('matches original for title:description format', () => {
    const input = 'Charge Nurse: Led team of 8 nurses';
    expect(parseEntriesWithTitleDescription(input)).toEqual(parseEntriesLeadership(input));
  });

  it('matches original for multiple lines', () => {
    const input = `Charge Nurse: Led team of 8 nurses
Preceptor: Trained 5 new grads`;
    expect(parseEntriesWithTitleDescription(input)).toEqual(parseEntriesLeadership(input));
  });

  it('matches original for long prefix (>50 chars)', () => {
    const longTitle = 'A'.repeat(51) + ': description';
    expect(parseEntriesWithTitleDescription(longTitle)).toEqual(parseEntriesLeadership(longTitle));
  });

  it('matches original for edge case (colonIndex = 49)', () => {
    const title49 = 'A'.repeat(49);
    const input = `${title49}: description`;
    expect(parseEntriesWithTitleDescription(input)).toEqual(parseEntriesLeadership(input));
  });
});

describe('NEW: parseEntriesAsStrings (replaces ResearchSection)', () => {
  it('matches original for null/undefined', () => {
    expect(parseEntriesAsStrings(null)).toEqual(parseEntriesResearch(null));
    expect(parseEntriesAsStrings(undefined)).toEqual(parseEntriesResearch(undefined));
    expect(parseEntriesAsStrings('')).toEqual(parseEntriesResearch(''));
  });

  it('matches original minLength filtering', () => {
    expect(parseEntriesAsStrings('Short')).toEqual(parseEntriesResearch('Short'));
    expect(parseEntriesAsStrings('Exactly 10')).toEqual(parseEntriesResearch('Exactly 10'));
    expect(parseEntriesAsStrings('Exactly 11c')).toEqual(parseEntriesResearch('Exactly 11c'));
  });

  it('matches original for newline splitting', () => {
    const input = `First research project here
Second research project here`;
    expect(parseEntriesAsStrings(input)).toEqual(parseEntriesResearch(input));
  });

  it('matches original for sentence splitting', () => {
    const input = 'First project here. Second project here.';
    expect(parseEntriesAsStrings(input)).toEqual(parseEntriesResearch(input));
  });
});

describe('NEW: parseEntriesWithIds (replaces ResumeBoosterEditSheet)', () => {
  it('matches original for null/undefined', () => {
    expect(parseEntriesWithIds(null)).toEqual(parseEntriesBooster(null));
    expect(parseEntriesWithIds(undefined)).toEqual(parseEntriesBooster(undefined));
    expect(parseEntriesWithIds('')).toEqual(parseEntriesBooster(''));
  });

  it('matches original for array passthrough', () => {
    const input = [{ id: '1', title: 'Test', description: 'Desc' }];
    expect(parseEntriesWithIds(input)).toBe(input);
  });

  it('matches original for title:description with id', () => {
    const input = 'Title: Description';
    expect(parseEntriesWithIds(input)).toEqual(parseEntriesBooster(input));
  });

  it('matches original for colonIndex < 60 threshold', () => {
    const title59 = 'A'.repeat(59);
    const input = `${title59}: description`;
    expect(parseEntriesWithIds(input)).toEqual(parseEntriesBooster(input));
  });

  it('matches original for colonIndex = 60 (edge case)', () => {
    const title60 = 'A'.repeat(60);
    const input = `${title60}: description`;
    expect(parseEntriesWithIds(input)).toEqual(parseEntriesBooster(input));
  });

  it('matches original for sequential ids', () => {
    const input = `First: desc1
Second: desc2`;
    expect(parseEntriesWithIds(input)).toEqual(parseEntriesBooster(input));
  });
});

describe('NEW: entriesToString', () => {
  it('returns empty string for null/undefined', () => {
    expect(entriesToString(null)).toBe('');
    expect(entriesToString(undefined)).toBe('');
    expect(entriesToString([])).toBe('');
  });

  it('formats title only entries', () => {
    const entries = [{ title: 'Charge Nurse', description: '' }];
    expect(entriesToString(entries)).toBe('Charge Nurse');
  });

  it('formats title:description entries', () => {
    const entries = [{ title: 'Charge Nurse', description: 'Led team' }];
    expect(entriesToString(entries)).toBe('Charge Nurse: Led team');
  });

  it('joins multiple entries with newlines', () => {
    const entries = [
      { title: 'First', description: 'desc1' },
      { title: 'Second', description: 'desc2' },
    ];
    expect(entriesToString(entries)).toBe('First: desc1\nSecond: desc2');
  });

  it('filters out empty titles', () => {
    const entries = [
      { title: 'Valid', description: 'desc' },
      { title: '', description: 'ignored' },
      { title: '  ', description: 'also ignored' },
    ];
    expect(entriesToString(entries)).toBe('Valid: desc');
  });

  it('roundtrips with parseEntriesWithTitleDescription', () => {
    const original = `Charge Nurse: Led team of 8
Preceptor: Trained new grads`;
    const parsed = parseEntriesWithTitleDescription(original);
    const serialized = entriesToString(parsed);
    expect(serialized).toBe(original);
  });
});

describe('NEW: parseEntries (unified API)', () => {
  it('works with all option combinations', () => {
    const input = 'Title: Description';

    // Default - returns strings
    expect(parseEntries(input)).toEqual(['Title: Description']);

    // With title/description parsing
    expect(parseEntries(input, { parseTitleDescription: true })).toEqual([
      { title: 'Title', description: 'Description' }
    ]);

    // With ids
    expect(parseEntries(input, { parseTitleDescription: true, addIds: true })).toEqual([
      { id: 'entry-0', title: 'Title', description: 'Description' }
    ]);
  });

  it('respects minLength option', () => {
    expect(parseEntries('Short', { minLength: 10 })).toEqual([]);
    expect(parseEntries('Long enough text', { minLength: 10 })).toEqual(['Long enough text']);
  });

  it('respects colonThreshold option', () => {
    const title10 = 'A'.repeat(10);
    const input = `${title10}: description`;

    // Threshold 15 - should parse
    const result15 = parseEntries(input, { parseTitleDescription: true, colonThreshold: 15 });
    expect(result15[0].title).toBe(title10);
    expect(result15[0].description).toBe('description');

    // Threshold 5 - should NOT parse
    const result5 = parseEntries(input, { parseTitleDescription: true, colonThreshold: 5 });
    expect(result5[0].title).toBe(input);
    expect(result5[0].description).toBe('');
  });
});
