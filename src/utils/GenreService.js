/**
 * @fileoverview Genre resolution service for the Podwave podcast discovery app.
 *
 * Maps numeric genre IDs (returned by the API) to human-readable genre
 * titles defined in data.js. Keeps genre logic out of components.
 *
 * @principle SRP — This module is solely responsible for mapping genre IDs to titles.
 * @module utils/GenreService
 */

import { genres } from '../data.js';

/**
 * Service object for resolving genre IDs to genre metadata.
 *
 * @namespace GenreService
 */
export const GenreService = {
  /**
   * Resolves an array of genre IDs to their corresponding title strings.
   *
   * @param {number[]} genreIds - Array of numeric genre IDs.
   * @returns {string[]} Array of genre title strings. Returns "Unknown" for unrecognised IDs.
   *
   * @example
   * GenreService.getNames([1, 3]);
   * // → ["Personal Growth", "History"]
   */
  getNames(genreIds) {
    if (!Array.isArray(genreIds)) return [];
    return genreIds.map(
      (id) => genres.find((g) => g.id === id)?.title ?? 'Unknown'
    );
  },

  /**
   * Returns the full genre object for a given ID.
   *
   * @param {number} id - A numeric genre ID.
   * @returns {Object|undefined} The matching genre object, or undefined if not found.
   *
   * @example
   * GenreService.getById(2);
   * // → { id: 2, title: "Investigative Journalism", ... }
   */
  getById(id) {
    return genres.find((g) => g.id === id);
  },

  /**
   * Returns all available genres.
   *
   * @returns {Array<Object>} Full array of genre objects from data.js.
   */
  getAll() {
    return genres;
  },
};
