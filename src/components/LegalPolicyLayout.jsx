import { useState, useEffect, useCallback } from 'react';
import PageBanner from './PageBanner';
import SEO from './SEO';

const SCROLL_OFFSET = 108;

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
    <div className="legal-policy-page site-page w-full bg-site-bg text-site-text">
      <SEO {...seo} />
      <PageBanner {...banner} />

      <div className="legal-policy-layout site-banner-content-gap">
        <aside className="legal-policy-sidebar" aria-label="Page contents">
          <nav className="legal-policy-sidebar__nav">
            <p className="legal-policy-sidebar__heading">Contents</p>
            <div className="legal-policy-sidebar__list">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`legal-policy-sidebar__btn${isActive ? ' legal-policy-sidebar__btn--active' : ''}`}
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <main className="legal-policy-main">{children}</main>
      </div>
    </div>
  );
}

export default LegalPolicyLayout;
