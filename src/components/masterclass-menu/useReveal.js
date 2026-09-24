import { useEffect, useRef } from 'react';

/**
 * Sets `data-in` on every `.mcm-reveal` inside the returned ref once it scrolls into view.
 * An attribute (not a class) so React re-renders that rewrite `className` don't hide it again.
 */
export default function useReveal() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const targets = root.querySelectorAll('.mcm-reveal');

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.setAttribute('data-in', ''));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return rootRef;
}
