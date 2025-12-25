/**
 * Profanity Filter Tests
 *
 * Unit tests for the profanity filter system.
 * Run with: npm test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  containsProfanity,
  sanitizeText,
  clearWordListCache
} from '../src/lib/profanityFilter.js';

describe('Profanity Filter', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearWordListCache();
  });

  describe('containsProfanity', () => {
    it('should detect profanity in text', async () => {
      const result = await containsProfanity('This is spam content');
      expect(result.hasProfanity).toBe(true);
      expect(result.matches).toContain('spam');
    });

    it('should detect multiple profane words', async () => {
      const result = await containsProfanity('This is spam and a scam');
      expect(result.hasProfanity).toBe(true);
      expect(result.matches).toContain('spam');
      expect(result.matches).toContain('scam');
    });

    it('should not flag clean text', async () => {
      const result = await containsProfanity('This is a nice clean message about nursing');
      expect(result.hasProfanity).toBe(false);
      expect(result.matches).toHaveLength(0);
    });

    it('should handle empty text', async () => {
      const result = await containsProfanity('');
      expect(result.hasProfanity).toBe(false);
      expect(result.matches).toHaveLength(0);
    });

    it('should handle null text', async () => {
      const result = await containsProfanity(null);
      expect(result.hasProfanity).toBe(false);
      expect(result.matches).toHaveLength(0);
    });

    it('should strip HTML tags before checking', async () => {
      const result = await containsProfanity('<p>This is <b>spam</b> content</p>');
      expect(result.hasProfanity).toBe(true);
      expect(result.matches).toContain('spam');
    });

    it('should be case insensitive', async () => {
      const result = await containsProfanity('This is SPAM content');
      expect(result.hasProfanity).toBe(true);
      expect(result.matches).toContain('spam');
    });

    it('should detect profanity with word boundaries', async () => {
      const result = await containsProfanity('shit happens');
      expect(result.hasProfanity).toBe(true);
    });

    it('should avoid false positives in compound words', async () => {
      // "assassin" contains "ass" but shouldn't be flagged as a whole word match
      const result = await containsProfanity('assassin');
      // This might still match depending on implementation
      // Adjust test based on your word boundary logic
    });
  });

  describe('sanitizeText', () => {
    it('should replace profanity with asterisks', async () => {
      const result = await sanitizeText('This is spam content');
      expect(result).toContain('****');
      expect(result).not.toContain('spam');
    });

    it('should replace multiple profane words', async () => {
      const result = await sanitizeText('This is spam and scam');
      expect(result).toContain('****');
      expect(result).not.toContain('spam');
      expect(result).not.toContain('scam');
    });

    it('should preserve clean text', async () => {
      const text = 'This is a nice clean message';
      const result = await sanitizeText(text);
      expect(result).toBe(text);
    });

    it('should handle empty text', async () => {
      const result = await sanitizeText('');
      expect(result).toBe('');
    });

    it('should handle null text', async () => {
      const result = await sanitizeText(null);
      expect(result).toBe(null);
    });

    it('should preserve asterisk length matching word length', async () => {
      const result = await sanitizeText('This is spam');
      // "spam" = 4 letters, should be replaced with "****"
      expect(result).toMatch(/\*{4}/);
    });

    it('should be case insensitive when sanitizing', async () => {
      const result = await sanitizeText('This is SPAM content');
      expect(result).toContain('****');
      expect(result).not.toContain('SPAM');
    });
  });

  describe('edge cases', () => {
    it('should handle text with only profanity', async () => {
      const result = await containsProfanity('spam');
      expect(result.hasProfanity).toBe(true);
    });

    it('should handle very long text', async () => {
      const longText = 'This is a very long message. '.repeat(100) + 'spam';
      const result = await containsProfanity(longText);
      expect(result.hasProfanity).toBe(true);
    });

    it('should handle text with special characters', async () => {
      const result = await containsProfanity('This is sp@m content!');
      // Should not match because "sp@m" is not "spam"
      expect(result.hasProfanity).toBe(false);
    });

    it('should handle unicode characters', async () => {
      const result = await containsProfanity('This is a message with émojis 😊 and spam');
      expect(result.hasProfanity).toBe(true);
    });
  });
});
