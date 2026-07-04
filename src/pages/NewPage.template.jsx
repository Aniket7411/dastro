/**
 * Copy this file when adding a new public page (not routed — template only).
 * MainLayout auto-wraps routes in tw-page (Bootstrap isolation).
 */
import SEO from '../components/SEO';
import PageSection from '../components/layout/PageSection';
import {
  PAGE_WRAP,
  TW_KICKER,
  TW_H1,
  TW_BODY,
  TW_STACK,
  SITE_BTN_PRIMARY,
} from '../utils/siteTokens';

export default function NewPageTemplate() {
  return (
    <>
      <SEO title="Page Title" description="Short description for search engines." url="/your-path" />

      <PageSection className="border-b border-site-accent-dark/10 bg-site-bg">
        <div className={`${PAGE_WRAP} ${TW_STACK}`}>
          <span className={TW_KICKER}>Eyebrow</span>
          <h1 className={TW_H1}>Page heading</h1>
          <p className={TW_BODY}>Intro paragraph — use flex layouts for rows, grid only when needed.</p>
          <a href="/contact" className={`${SITE_BTN_PRIMARY} w-fit`}>
            Call to action
          </a>
        </div>
      </PageSection>

      <PageSection className="bg-white">
        <div className={PAGE_WRAP}>
          <p className={TW_BODY}>More content sections go here.</p>
        </div>
      </PageSection>
    </>
  );
}
