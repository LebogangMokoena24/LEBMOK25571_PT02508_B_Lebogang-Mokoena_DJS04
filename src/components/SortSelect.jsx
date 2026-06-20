/**
 * @fileoverview SortSelect component for the Podwave podcast discovery app.
 *
 * Renders a dropdown that sets the sort order applied to the filtered podcast list.
 * Three options are provided (P3.56–P3.57):
 * - newest    → sorted by last-updated date, descending
 * - title-az  → alphabetical A → Z
 * - title-za  → reverse alphabetical Z → A
 *
 * Sorting is applied after genre and search filtering without resetting them (P3.58).
 *
 * @module components/SortSelect
 */

import React, { useCallback } from 'react';
import { usePodcasts } from '../context/PodcastContext.jsx';
import './SortSelect.module.css';

/**
 * Available sort order options.
 * @type {Array<{value: string, label: string}>}
 */
const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest first' },
  { value: 'title-az', label: 'Title A–Z'    },
  { value: 'title-za', label: 'Title Z–A'    },
];

/**
 * Sort order dropdown — integrates with PodcastContext.
 *
 * @returns {JSX.Element} The rendered sort select control.
 */
function SortSelect() {
  const { sortOrder, handleSortChange } = usePodcasts();

  /**
   * Propagates the selected sort key to context.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The select change event.
   */
  const handleChange = useCallback(
    (e) => {
      handleSortChange(e.target.value);
    },
    [handleSortChange]
  );

  return (
    <div className="sort-select">
      <label htmlFor="sort-order" className="sort-select__label">
        Sort by
      </label>
      <div className="sort-select__select-wrap">
        <select
          id="sort-order"
          className="sort-select__select"
          value={sortOrder}
          onChange={handleChange}
          aria-label="Sort podcasts"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="sort-select__chevron" aria-hidden="true">▾</span>
      </div>
    </div>
  );
}

export default SortSelect;
