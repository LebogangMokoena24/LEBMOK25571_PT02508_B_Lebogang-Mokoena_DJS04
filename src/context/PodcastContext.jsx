/**
 * @fileoverview PodcastContext — centralised state management for the Podwave app.
 *
 * Provides a single source of truth for:
 * - Raw podcast data fetched from the API
 * - Search query, genre filter, and sort order state
 * - Derived filtered and sorted podcast list (via useMemo)
 * - Pagination state: current page, total pages, and the current page slice
 *
 * All UI controls (SearchBar, SortSelect, GenreFilter, Pagination) consume
 * and mutate state exclusively through this context, ensuring every combination
 * of inputs produces a consistent, synchronised result (P3.67).
 *
 * @module context/PodcastContext
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { fetchPodcasts } from '../api/fetchPodcasts.js';
import { applyFilters } from '../utils/FilterUtils.js';

/** @type {React.Context} */
const PodcastContext = createContext(null);

/**
 * Number of podcast cards displayed per page.
 * @constant {number}
 */
const PAGE_SIZE = 12;

/**
 * PodcastProvider wraps the application tree and exposes all shared state
 * via context. Children access it through the `usePodcasts` hook.
 *
 * @param {Object}          props                 - React props.
 * @param {React.ReactNode} props.children        - Child components.
 * @param {Array<Object>}   [props.initialPodcasts=[]] - Optional pre-loaded podcasts (for testing).
 * @returns {JSX.Element}
 */
export function PodcastProvider({ children, initialPodcasts = [] }) {
  /** @type {[Array<Object>, Function]} Raw podcast data from the API */
  const [podcasts, setPodcasts] = useState(initialPodcasts);

  /** @type {[boolean, Function]} True while the initial fetch is in progress */
  const [loading, setLoading] = useState(initialPodcasts.length === 0);

  /** @type {[string|null, Function]} Error message string, or null if no error */
  const [error, setError] = useState(null);

  /** @type {[string, Function]} Current text search query (P3.53–P3.55) */
  const [searchQuery, setSearchQuery] = useState('');

  /** @type {[number|null, Function]} Selected genre ID, or null for all genres (P3.59–P3.61) */
  const [genreId, setGenreId] = useState(null);

  /** @type {[string, Function]} Active sort order key (P3.56–P3.58) */
  const [sortOrder, setSortOrder] = useState('newest');

  /** @type {[number, Function]} Current page number — 1-indexed (P3.62–P3.65) */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Fetches podcast data once on mount.
   * Skipped when initialPodcasts are provided (testing/SSR scenarios).
   */
  useEffect(() => {
    if (initialPodcasts.length > 0) return;

    setLoading(true);
    fetchPodcasts()
      .then((data) => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while fetching podcasts.');
        setLoading(false);
      });
  }, []);

  /**
   * Derived: full filtered + sorted list.
   * Only recalculated when podcasts, searchQuery, genreId, or sortOrder changes.
   * Satisfies P3.58 (sort + filter) and P3.60 (filter + search + sort combined).
   */
  const filteredPodcasts = useMemo(
    () => applyFilters(podcasts, { searchQuery, genreId, sortOrder }),
    [podcasts, searchQuery, genreId, sortOrder]
  );

  /**
   * Total number of pages given the current filtered result set.
   * @type {number}
   */
  const totalPages = Math.max(1, Math.ceil(filteredPodcasts.length / PAGE_SIZE));

  /**
   * The slice of filteredPodcasts visible on the current page (P3.62, P3.64).
   * Recalculated only when filteredPodcasts or currentPage changes.
   */
  const pagedPodcasts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPodcasts.slice(start, start + PAGE_SIZE);
  }, [filteredPodcasts, currentPage]);

  /**
   * Resets pagination to page 1 whenever the filter output changes.
   * Prevents the user being stranded on a page that no longer exists (P3.65).
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genreId, sortOrder]);

  /**
   * Updates the search query. Does not reset genre or sort (P3.55).
   *
   * @param {string} query - The new search query string.
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  /**
   * Updates the active genre filter. Does not reset search or sort (P3.61).
   *
   * @param {number|null} id - Genre ID to filter by, or null to show all genres.
   */
  const handleGenreChange = useCallback((id) => {
    setGenreId(id);
  }, []);

  /**
   * Updates the active sort order. Does not reset search or genre (P3.58).
   *
   * @param {string} order - One of 'newest' | 'title-az' | 'title-za'.
   */
  const handleSortChange = useCallback((order) => {
    setSortOrder(order);
  }, []);

  /**
   * Navigates to a specific page number.
   * Clamps the value to the valid range [1, totalPages] (P3.65).
   *
   * @param {number} page - Target page number.
   */
  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.min(Math.max(1, page), totalPages));
    },
    [totalPages]
  );

  const value = {
    // Raw data
    podcasts,
    loading,
    error,
    // Filter state
    searchQuery,
    genreId,
    sortOrder,
    // Handlers
    handleSearch,
    handleGenreChange,
    handleSortChange,
    // Pagination
    currentPage,
    totalPages,
    pagedPodcasts,
    goToPage,
    // Counts
    totalFiltered: filteredPodcasts.length,
    totalAll: podcasts.length,
  };

  return (
    <PodcastContext.Provider value={value}>
      {children}
    </PodcastContext.Provider>
  );
}

/**
 * Custom hook for consuming PodcastContext.
 * Must be used within a PodcastProvider tree.
 *
 * @returns {Object} The full podcast context value object.
 * @throws {Error} If called outside of a PodcastProvider.
 *
 * @example
 * const { pagedPodcasts, handleSearch } = usePodcasts();
 */
export function usePodcasts() {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error('usePodcasts must be used within a PodcastProvider');
  }
  return context;
}
