import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-page site-page">
      <div className="container site-container">
        <div className="not-found-card">
          <span className="site-kicker">404</span>
          <h1>Page Not Found</h1>
          <p>The page you are trying to open is not available. You can return to the website and continue from there.</p>
          <Link to="/" className="site-btn">
            Back to Website
          </Link>
        </div>
      </div>

      <style>{`
        .not-found-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          background: var(--site-bg);
        }

        .not-found-card {
          max-width: 34rem;
          margin: 0 auto;
          text-align: center;
          background: var(--site-surface);
          border: 1px solid var(--site-border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-card);
          padding: clamp(1.5rem, 5vw, 2.5rem);
        }

        .not-found-card h1 {
          font-family: var(--font-heading);
          color: var(--site-text);
          font-size: var(--h1-size);
          margin-bottom: 0.8rem;
        }

        .not-found-card p {
          color: var(--site-muted);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}

export default NotFound;
