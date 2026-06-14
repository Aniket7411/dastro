import { Link } from 'react-router-dom';
import TailwindTestPlayground from '../components/dev/TailwindTestPlayground';

/**
 * Dev-only route: /tailwind
 * Renders whatever you put in TailwindTestPlayground.jsx — nothing else is pre-built here.
 */
export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-site-bg py-8 font-body text-site-text">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-site-primary">Tailwind playground</h1>
            <p className="mt-1 text-sm text-site-muted">
              Edit{' '}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                src/components/dev/TailwindTestPlayground.jsx
              </code>
            </p>
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-site-accent no-underline hover:underline"
          >
            ← Home
          </Link>
        </div>

        {/* Canary: if this looks styled, Tailwind works on this route */}
        <div className="mb-8 rounded-lg border border-dashed border-site-accent/50 bg-white p-4 text-sm text-site-muted">
          Tailwind canary:{' '}
          <span className="inline-block rounded-lg bg-site-accent px-4 py-2 font-bold text-white">
            bg-site-accent p-4
          </span>
          {' '}— orange box with padding means utilities are applying.
        </div>

        <TailwindTestPlayground />
      </div>
    </div>
  );
}
