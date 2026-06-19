import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top whenever the route changes — unless the
 * URL has a hash, in which case we let the browser anchor to it. This is
 * the common UX users expect from a multi-page site.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Defer so the target node is mounted.
      const t = setTimeout(() => {
        const node = document.getElementById(hash.slice(1));
        if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    return undefined;
  }, [pathname, hash]);
  return null;
}
