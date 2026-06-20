/**
 * @fileoverview PodcastGrid component for the Podwave podcast discovery app.
 *
 * Renders the current page of filtered and sorted podcast cards sourced from
 * PodcastContext. Displays an actionable empty-state when no results match
 * the active search or filter criteria.
 *
 * @module components/PodcastGrid
 */

import React from 'react';
import { usePodcasts } from '../context/PodcastContext.jsx';
import PodcastCard from './PodcastCard.jsx';
import './PodcastGrid.module.css';

/**
 * Responsive grid of PodcastCard components for the current page.
 * Pulls pagedPodcasts and totalFiltered directly from PodcastContext.
 *
 * @returns {JSX.Element} The rendered podcast grid or an empty-state message.
 */
function PodcastGrid() {
  const { pagedPodcasts, totalFiltered, loading } = usePodcasts();

  if (!loading && totalFiltered === 0) {
    return (
      <div className="podcast-grid__empty" role="status">
        <span className="podcast-grid__empty-icon" aria-hidden="true">◈</span>
        <p className="podcast-grid__empty-text">No podcasts match your search.</p>
        <p className="podcast-grid__empty-hint">
          Try adjusting your search term, genre, or sort order.
        </p>
      </div>
    );
  }

  return (
    <section className="podcast-grid" aria-label="Podcast grid">
      {pagedPodcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </section>
  );
}

export default PodcastGrid;
