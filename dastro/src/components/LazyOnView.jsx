import { useEffect, useRef, useState } from 'react';

/**
 * Renders children only when the placeholder enters (or nears) the viewport.
 * Reduces initial JS work and below-fold network requests on long pages.
 */
export default function LazyOnView({
  children,
  className = '',
  rootMargin = '180px 0px',
  minHeight = '1px',
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={!visible && minHeight ? { minHeight } : undefined}
    >
      {visible ? children : null}
    </Tag>
  );
}
