import { useState, useEffect, useCallback } from 'react';
import PageBanner from './PageBanner';
import SEO from './SEO';
import { BANNER_CONTENT_GAP, PAGE_WRAP, POLICY_MAIN, SITE_PAGE } from '../utils/siteTokens';

const SCROLL_OFFSET = 108;

const SIDEBAR_BTN =
  'shrink-0 cursor-pointer rounded-[0.55rem] border border-transparent bg-transparent px-3 py-2 text-left text-[0.8125rem] font-bold leading-snug text-[#4b2a16] transition hover:bg-[#fff6ea]/85 lg:w-full lg:whitespace-normal';

const SIDEBAR_BTN_ACTIVE =
  'border border-site-accent-dark/18 border-l-4 border-l-site-accent-dark bg-[#fff6ea] pl-[calc(0.65rem-3px)] text-site-text';

function LegalPolicyLayout({ seo, banner, sections, children }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + SCROLL_OFFSET;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(id);
    }
  }, []);

  return (
    <div className={`${SITE_PAGE} w-full`}>
      <SEO {...seo} />
      <PageBanner {...banner} />

      <div
        className={`grid grid-cols-1 items-start gap-4 pb-[clamp(1.75rem,4vw,2.5rem)] lg:grid-cols-[minmax(13.5rem,16.5rem)_minmax(0,1fr)] lg:gap-6 ${BANNER_CONTENT_GAP} ${PAGE_WRAP}`}
      >
        <aside className="relative z-[2] w-full lg:sticky lg:top-[calc(clamp(4.5rem,6vw,5.4rem)+0.75rem)] lg:max-h-[calc(100vh-clamp(4.5rem,6vw,5.4rem)-1.5rem)]">
          <nav className="flex flex-col rounded-xl border border-site-accent-dark/14 bg-[#fffaf3]/96 p-3 shadow-[0_14px_35px_rgba(42,15,2,0.06)] lg:max-h-[inherit] lg:overflow-y-auto">
            <p className="mb-2 hidden px-[0.45rem] font-body text-kicker font-extrabold uppercase tracking-[0.12em] text-site-accent-dark lg:block">
              Contents
            </p>
            <div className="flex flex-row flex-nowrap gap-[0.45rem] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`${SIDEBAR_BTN}${isActive ? ` ${SIDEBAR_BTN_ACTIVE}` : ''}`}
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <main className={POLICY_MAIN}>{children}</main>
      </div>
    </div>
  );
}

export default LegalPolicyLayout;
