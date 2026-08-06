import { Redirect } from 'wouter';

/** Legacy route — widget builder merged into Assistant config. */
export function WidgetPage() {
  return <Redirect to="/app/builder" />;
}
