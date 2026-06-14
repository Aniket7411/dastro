import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageLoader } from '../components/PageLoader';

function MainLayout() {
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-site-bg font-body text-site-text">
      <Header />
      <main className="min-h-[80vh] w-full bg-site-bg pt-site-header">
        <Suspense fallback={<PageLoader label="Loading…" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
