/**
 * @fileoverview SearchBar component for the Podwave podcast discovery app.
 *
 * Provides a controlled text input that calls handleSearch on every keystroke,
 * enabling live, real-time search results (P3.54). An explicit clear button
 * lets users reset the query without touching genre or sort state (P3.55).
 *
 * @module components/SearchBar
 */

import React, { useCallback } from 'react';
import { usePodcasts } from '../context/PodcastContext.jsx';
import './SearchBar.module.css';

/**
 * Live search input — filters podcasts by title substring as the user types.
 * Integrates with PodcastContext; does not own any filter state itself.
 *
 * @returns {JSX.Element} The rendered search bar.
 */
function SearchBar() {
  const { searchQuery, handleSearch } = usePodcasts();

  /**
   * Propagates input change events to context as a plain string.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = useCallback(
    (e) => {
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  /**
   * Clears the current search query without resetting other filter state.
   */
  const handleClear = useCallback(() => {
    handleSearch('');
  }, [handleSearch]);

  return (
    <div className="search-bar" role="search">
      <label htmlFor="podcast-search" className="search-bar__label">
        Search
      </label>
      <div className="search-bar__input-wrap">
        <span className="search-bar__icon" aria-hidden="true">⌕</span>
        <input
          id="podcast-search"
          type="search"
          className="search-bar__input"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search podcasts…"
          autoComplete="off"
          aria-label="Search podcasts by title"
        />
        {searchQuery && (
          <button
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
