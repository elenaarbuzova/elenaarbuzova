const WORK_SCROLL_KEY = 'portfolio:work-scroll';
export const PENDING_SECTION_KEY = 'portfolio:pending-section';

function jumpTo(top: number) {
  const html = document.documentElement;
  const body = document.body;

  html.style.setProperty('scroll-behavior', 'auto', 'important');
  body.style.setProperty('scroll-behavior', 'auto', 'important');
  window.scrollTo({ top, left: 0, behavior: 'auto' });

  requestAnimationFrame(() => {
    html.style.removeProperty('scroll-behavior');
    body.style.removeProperty('scroll-behavior');
  });
}

export function saveWorkScroll() {
  sessionStorage.setItem(WORK_SCROLL_KEY, String(Math.round(window.scrollY)));
}

export function rememberHomeSection(id: string) {
  sessionStorage.setItem(PENDING_SECTION_KEY, id);
}

export function applyHomeScroll() {
  const pending = sessionStorage.getItem(PENDING_SECTION_KEY);
  const hash = pending || window.location.hash.replace(/^#/, '');
  if (!hash) return false;

  if (hash === 'work') {
    const saved = sessionStorage.getItem(WORK_SCROLL_KEY);
    const y = saved != null ? Number(saved) : NaN;
    if (Number.isFinite(y) && y > 0) {
      jumpTo(y);
      window.history.replaceState(null, '', '#work');
      sessionStorage.removeItem(PENDING_SECTION_KEY);
      return true;
    }
  }

  const el = document.getElementById(hash);
  if (!el) return false;

  jumpTo(el.getBoundingClientRect().top + window.scrollY);
  window.history.replaceState(null, '', `#${hash}`);
  sessionStorage.removeItem(PENDING_SECTION_KEY);
  return true;
}
