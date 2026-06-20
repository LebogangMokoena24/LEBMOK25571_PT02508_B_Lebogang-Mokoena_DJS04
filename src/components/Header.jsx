/**
 * @fileoverview Header component for the Podwave podcast discovery app.
 *
 * Displays the Podwave brand mark, live show count, and hero headline.
 * The count is sourced from PodcastContext so it always reflects the total
 * number of shows in the catalogue, independent of active filters.
 *
 * @module components/Header
 */

import React from 'react';
import { usePodcasts } from '../context/PodcastContext.jsx';
import './Header.module.css';

/**
 * Site header: brand, live podcast count, hero title, and tagline.
 *
 * @returns {JSX.Element} The rendered header element.
 */
function Header() {
  const { totalAll } = usePodcasts();

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__logo-mark">◈</span>
          <span className="header__wordmark">Podwave</span>
        </div>

        <div className="header__meta">
          {totalAll > 0 && (
            <span className="header__count">{totalAll} shows</span>
          )}
        </div>
      </div>

      <div className="header__hero">
        <h1 className="header__title">
          Your next obsession<br />
          <em>is waiting.</em>
        </h1>
        <p className="header__tagline">
          Discover podcasts worth your time — search, filter, and sort a live catalogue.
        </p>
      </div>
    </header>
  );
}

export default Header;
