import { Suspense, lazy, useEffect, useState } from 'react';
import { runWhenIdle } from '../utils/loadScript';

const FloatingChatAssistant = lazy(() => import('./FloatingChatAssistant'));
const AstrologerChatFab = lazy(() => import('./AstrologerChatFab'));
const SiteOffersModal = lazy(() => import('./offers/SiteOffersModal'));

/** Chat FABs + offers modal — loaded after first paint / idle time. */
export function DeferredGlobalWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => runWhenIdle(() => setReady(true), 3000), []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <AstrologerChatFab />
      <FloatingChatAssistant />
    </Suspense>
  );
}

export function DeferredSiteOffersModal() {
  const [ready, setReady] = useState(false);

  useEffect(() => runWhenIdle(() => setReady(true), 4000), []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <SiteOffersModal />
    </Suspense>
  );
}
