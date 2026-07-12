import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageLoader } from '../components/PageLoader';
import { DeferredSiteOffersModal } from '../components/DeferredSiteWidgets';
import { SKIP_LAYOUT_TW_PAGE_PATHS, TW_PAGE_ROOT } from '../utils/siteTokens';


function MainLayout() {
  const { pathname } = useLocation();
  const useTailwindIsolation = !SKIP_LAYOUT_TW_PAGE_PATHS.has(pathname);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-site-bg font-body text-site-text">
      <Header />
      <main className="relative min-h-[80vh] w-full bg-site-bg pt-site-header">
        <Suspense fallback={<PageLoader label="Loading…" />}>
          {useTailwindIsolation ? (
            <div className={TW_PAGE_ROOT}>
              <Outlet />
            </div>
          ) : (
            <Outlet />
          )}
        </Suspense>
      </main>
      <Footer />
      <DeferredSiteOffersModal />
    </div>
  );
}

export default MainLayout;
