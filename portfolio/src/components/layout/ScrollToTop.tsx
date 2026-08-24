import { useLayoutEffect } from 'react';
import { useLocation } from 'wouter';

/** Jump to top instantly — ignores html { scroll-behavior: smooth }. */
export function scrollToTopInstant() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  html.style.scrollBehavior = previous;
}

/** Instant top on route change (project links), without the smooth bottom→top scroll. */
export function ScrollToTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    // Keep smooth in-page anchors (e.g. /#work); only force jump on path changes.
    if (window.location.hash) return;
    scrollToTopInstant();
  }, [location]);

  return null;
}
