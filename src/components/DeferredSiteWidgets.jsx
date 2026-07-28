import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { runWhenIdle } from '../utils/loadScript';
import { shouldLoadOffersModal } from '../utils/offerApi';

const FloatingChatAssistant = lazy(() => import('./FloatingChatAssistant'));
const AstrologerChatFab = lazy(() => import('./AstrologerChatFab'));
const SiteOffersModal = lazy(() => import('./offers/SiteOffersModal'));

/** Chat FABs — loaded after first paint / idle time. */
export function DeferredGlobalWidgets() {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const blockedPaths = ['/face-reading-masterclass'];

  useEffect(() => runWhenIdle(() => setReady(true), 3000), []);

  if (blockedPaths.includes(pathname) || !ready) return null;

  return (
    <Suspense fallback={null}>
      {/* <AstrologerChatFab /> */}
      {/* <FloatingChatAssistant /> */}
    </Suspense>
  );
}

/** Offers modal — only on marketing routes; skipped on About, legal, dashboard, tools, etc. */
export function DeferredSiteOffersModal() {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const allowed = shouldLoadOffersModal(pathname);

  useEffect(() => {
    if (!allowed) {
      setReady(false);
      return undefined;
    }
    // Home waits longer so course/consultation fetches settle first.
    const idleMs = pathname === '/' ? 6500 : 4000;
    return runWhenIdle(() => setReady(true), idleMs);
  }, [allowed, pathname]);

  if (!allowed || !ready) return null;

  return (
    <Suspense fallback={null}>
      <SiteOffersModal />
    </Suspense>
  );
}
