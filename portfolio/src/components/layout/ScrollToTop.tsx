import { useLayoutEffect } from 'react';
import { useLocation } from 'wouter';
import { applyHomeScroll, PENDING_SECTION_KEY } from '@/lib/homeScroll';

/** Jump to top with no animation — never inherits CSS smooth scrolling. */
export function scrollToTopInstant() {
  const html = document.documentElement;
  const body = document.body;

  html.style.setProperty('scroll-behavior', 'auto', 'important');
  body.style.setProperty('scroll-behavior', 'auto', 'important');

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  html.scrollTop = 0;
  body.scrollTop = 0;

  // Keep auto until after paint so a smooth CSS rule cannot animate this jump.
  requestAnimationFrame(() => {
    html.style.removeProperty('scroll-behavior');
    body.style.removeProperty('scroll-behavior');
  });
}

/** Instant top on route change, or restore Work/About/Contact position. */
export function ScrollToTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    const pending = sessionStorage.getItem(PENDING_SECTION_KEY);
    const hash = window.location.hash.replace(/^#/, '');

    if (location === '/' && (pending || hash)) {
      applyHomeScroll();
      requestAnimationFrame(() => applyHomeScroll());
      return;
    }

    if (hash) return;
    scrollToTopInstant();
  }, [location]);

  return null;
}
