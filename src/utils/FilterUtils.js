/**
 * @fileoverview Filter, search, and sort utilities for the Podwave podcast discovery app.
 *
 * All data transformation logic is centralised here so that the context
 * and components remain free of imperative array manipulation code.
 *
 * @module utils/FilterUtils
 */

/**
 * @typedef {Object} FilterState
 * @property {string}      searchQuery - The current text search query.
 * @property {number|null} genreId     - The selected genre ID, or null for all genres.
 * @property {string}      sortOrder   - One of 'newest' | 'title-az' | 'title-za'.
 */

/**
 * Filters and sorts a list of podcasts according to the supplied filter state.
 *
 * Operations are applied in order: filter by genre → filter by search → sort.
 * This ensures consistent, predictable results when multiple filters are active.
 *
 * @param {Array<Object>} podcasts    - Raw array of podcast preview objects from the API.
 * @param {FilterState}   filterState - The current search, genre, and sort selections.
 * @returns {Array<Object>} A new filtered and sorted array (original array is not mutated).
 *
 * @example
 * const results = applyFilters(podcasts, {
 *   searchQuery: 'true crime',
 *   genreId: 2,
 *   sortOrder: 'newest',
 * });
 */
export function applyFilters(podcasts, { searchQuery, genreId, sortOrder }) {
  let result = [...podcasts];

  // --- Genre filter ---
  if (genreId !== null && genreId !== undefined) {
    result = result.filter(
      (podcast) =>
        Array.isArray(podcast.genres) && podcast.genres.includes(genreId)
    );
  }

  // --- Search filter (case-insensitive substring match on title) ---
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.trim().toLowerCase();
    result = result.filter((podcast) =>
      podcast.title.toLowerCase().includes(query)
    );
  }

  // --- Sort ---
  result = sortPodcasts(result, sortOrder);

  return result;
}

/**
 * Sorts a podcast array by the given sort order key.
 *
 * @param {Array<Object>} podcasts  - Array of podcast objects to sort.
 * @param {string}        sortOrder - One of 'newest' | 'title-az' | 'title-za'.
 * @returns {Array<Object>} A new sorted array (original is not mutated).
 *
 * @example
 * const sorted = sortPodcasts(podcasts, 'title-az');
 */
export function sortPodcasts(podcasts, sortOrder) {
  const copy = [...podcasts];

  switch (sortOrder) {
    case 'newest':
      return copy.sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      );
    case 'title-az':
      return copy.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );
    case 'title-za':
      return copy.sort((a, b) =>
        b.title.localeCompare(a.title, undefined, { sensitivity: 'base' })
      );
    default:
      return copy;
  }
}
