/**
 * @fileoverview Pagination component for the Podwave podcast discovery app.
 *
 * Renders page navigation controls (Previous / numbered pages / Next) that
 * fully respect the currently active search, filter, and sort state (P3.64).
 * Changing page never resets search, genre, or sort selections (P3.65).
 * The component hides itself when only one page of results exists (P3.62).
 *
 * @module components/Pagination
 */

import React, { useCallback } from 'react';
import { usePodcasts } from '../context/PodcastContext.jsx';
import './Pagination.module.css';

/**
 * Maximum number of page buttons visible before ellipsis truncation.
 * @constant {number}
 */
const MAX_VISIBLE_PAGES = 7;

/**
 * Builds an array of page numbers interspersed with '…' ellipsis markers.
 * Keeps the first page, last page, and a window around the current page.
 *
 * @param {number} current - The currently active page (1-indexed).
 * @param {number} total   - Total number of pages.
 * @returns {Array<number|string>} Page numbers and '…' strings.
 *
 * @example
 * buildPageRange(5, 12);
 * // → [1, '…', 4, 5, 6, '…', 12]
 */
function buildPageRange(current, total) {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let prev = null;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const page of range) {
    if (prev !== null && page - prev > 1) {
      rangeWithDots.push('…');
    }
    rangeWithDots.push(page);
    prev = page;
  }

  return rangeWithDots;
}

/**
 * Page navigation controls — integrates with PodcastContext.
 * Returns null when only one page of results exists.
 *
 * @returns {JSX.Element|null} The rendered pagination bar, or null.
 */
function Pagination() {
  const { currentPage, totalPages, goToPage, totalFiltered } = usePodcasts();

  const handlePrev = useCallback(
    () => goToPage(currentPage - 1),
    [currentPage, goToPage]
  );

  const handleNext = useCallback(
    () => goToPage(currentPage + 1),
    [currentPage, goToPage]
  );

  if (totalPages <= 1) return null;

  const pageRange = buildPageRange(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Podcast pages">
      <p className="pagination__summary" aria-live="polite">
        Page {currentPage} of {totalPages}
        <span className="pagination__total"> — {totalFiltered} results</span>
      </p>

      <div className="pagination__controls">
        <button
          className="pagination__btn pagination__btn--nav"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {pageRange.map((item, idx) =>
          item === '…' ? (
            <span
              key={`ellipsis-${idx}`}
              className="pagination__ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              className={`pagination__btn${
                item === currentPage ? ' pagination__btn--active' : ''
              }`}
              onClick={() => goToPage(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        <button
          className="pagination__btn pagination__btn--nav"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
