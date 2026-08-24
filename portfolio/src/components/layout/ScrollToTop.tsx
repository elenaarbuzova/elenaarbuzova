import { useLayoutEffect } from 'react';
import { useLocation } from 'wouter';

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

/** Instant top on route change (e.g. opening a project from Work). */
export function ScrollToTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    if (window.location.hash) return;
    scrollToTopInstant();
  }, [location]);

  return null;
}
