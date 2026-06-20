/**
 * @fileoverview Date formatting utilities for the Podwave podcast discovery app.
 *
 * Uses date-fns for reliable, human-readable date output. All date logic
 * is centralised in this module to keep components clean.
 *
 * @principle SRP — This module is solely responsible for date formatting logic.
 * @module utils/DateUtils
 */

import { formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Utility object for date-related formatting operations.
 *
 * @namespace DateUtils
 */
export const DateUtils = {
  /**
   * Formats an ISO date string as a human-readable relative time string.
   * Falls back to "Unknown date" if parsing fails.
   *
   * @param {string} dateStr - An ISO 8601 date string (e.g. "2026-01-15T07:00:00.000Z").
   * @returns {string} Human-readable string such as "about 3 months ago".
   *
   * @example
   * DateUtils.formatRelative('2026-01-15T07:00:00.000Z');
   * // → "about 5 months ago"
   */
  formatRelative(dateStr) {
    try {
      const date = parseISO(dateStr);
      return `${formatDistanceToNow(date)} ago`;
    } catch {
      return 'Unknown date';
    }
  },

  /**
   * Formats an ISO date string as a full localised date (e.g. "January 15, 2026").
   *
   * @param {string} dateStr - An ISO 8601 date string.
   * @returns {string} Localised full date string, or "Unknown date" on failure.
   *
   * @example
   * DateUtils.formatFull('2026-01-15T07:00:00.000Z');
   * // → "January 15, 2026"
   */
  formatFull(dateStr) {
    try {
      const date = parseISO(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  },
};
