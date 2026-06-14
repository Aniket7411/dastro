import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageLoader } from '../components/PageLoader';

function MainLayout() {
  return (
    <div className="site-shell">
      <Header />
      <main className="site-main tw-surface w-full max-w-none min-h-[80vh]" style={{ paddingTop: 'var(--header-h)' }}>
        <Suspense fallback={<PageLoader label="Loading…" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
