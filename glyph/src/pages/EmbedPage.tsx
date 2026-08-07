import { useEffect, useMemo } from 'react';
import { LiveWidget } from '@/components/widget/LiveWidget';
import { DEFAULT_WIDGET, type WidgetConfig } from '@/lib/data';
import { useApp } from '@/lib/store';

function configFromSearch(search: string, base: WidgetConfig): WidgetConfig {
  const params = new URLSearchParams(search);
  const next: WidgetConfig = { ...base };

  const accent = params.get('accent');
  const name = params.get('name');
  const position = params.get('position');
  const avatar = params.get('avatar');
  const greeting = params.get('greeting');
  const size = params.get('size');
  const radius = params.get('radius');
  const launcherIcon = params.get('icon');
  const branding = params.get('branding');

  if (accent) next.accent = accent;
  if (name) next.name = name;
  if (avatar) next.avatar = avatar.slice(0, 1);
  if (greeting) next.greeting = greeting;
  if (position === 'bottom-left' || position === 'bottom-right') {
    next.position = position;
  }
  if (size === 'compact' || size === 'medium' || size === 'large') {
    next.size = size;
  }
  if (radius && !Number.isNaN(Number(radius))) {
    next.radius = Number(radius);
  }
  if (
    launcherIcon === 'chat' ||
    launcherIcon === 'dna' ||
    launcherIcon === 'flask'
  ) {
    next.launcherIcon = launcherIcon;
  }
  if (branding === '0' || branding === 'false') next.showBranding = false;
  if (branding === '1' || branding === 'true') next.showBranding = true;

  return next;
}

/** Public embed surface — no auth shell. Uses live Knowledge answers from this origin. */
export function EmbedPage() {
  const { widget } = useApp();
  const config = useMemo(
    () =>
      configFromSearch(
        typeof window !== 'undefined' ? window.location.search : '',
        { ...DEFAULT_WIDGET, ...widget },
      ),
    [widget],
  );

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    html.style.background = 'transparent';
    body.style.background = 'transparent';
    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent">
      <LiveWidget config={config} mode="embed" />
    </div>
  );
}
