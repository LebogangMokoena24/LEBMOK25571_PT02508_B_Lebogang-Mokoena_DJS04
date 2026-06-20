/**
 * @fileoverview GenreFilter component for the Podwave podcast discovery app.
 *
 * Renders a dropdown select populated with all available genres from data.js.
 * Selecting a genre narrows the podcast grid to matching shows (P3.59).
 * The filter combines with active search and sort without resetting them (P3.60).
 * An "All genres" option resets the genre filter back to null (P3.61).
 *
 * @module components/GenreFilter
 */

import React, { useCallback } from 'react';
import { usePodcasts } from '../context/PodcastContext.jsx';
import { genres } from '../data.js';
import './GenreFilter.module.css';

/**
 * Genre dropdown filter — integrates with PodcastContext.
 *
 * @returns {JSX.Element} The rendered genre filter control.
 */
function GenreFilter() {
  const { genreId, handleGenreChange } = usePodcasts();

  /**
   * Converts the string value from the DOM select to a number (or null for "all"),
   * then propagates the change to context.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The select change event.
   */
  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      handleGenreChange(val === '' ? null : Number(val));
    },
    [handleGenreChange]
  );

  return (
    <div className="genre-filter">
      <label htmlFor="genre-select" className="genre-filter__label">
        Genre
      </label>
      <div className="genre-filter__select-wrap">
        <select
          id="genre-select"
          className="genre-filter__select"
          value={genreId ?? ''}
          onChange={handleChange}
          aria-label="Filter podcasts by genre"
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.title}
            </option>
          ))}
        </select>
        <span className="genre-filter__chevron" aria-hidden="true">▾</span>
      </div>
    </div>
  );
}

export default GenreFilter;
