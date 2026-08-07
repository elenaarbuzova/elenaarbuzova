import { Redirect, Route, Switch, useLocation } from 'wouter';
import { useEffect } from 'react';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage, SignupPage } from '@/pages/AuthPages';
import { OnboardingRouter } from '@/pages/OnboardingPages';
import { OverviewPage } from '@/pages/app/OverviewPage';
import { KnowledgePage } from '@/pages/app/KnowledgePage';
import { PlaygroundPage } from '@/pages/app/PlaygroundPage';
import { BuilderPage } from '@/pages/app/BuilderPage';
import { AnalyticsPage } from '@/pages/app/AnalyticsPage';
import { BillingPage } from '@/pages/app/BillingPage';
import { SettingsPage } from '@/pages/app/SettingsPage';
import { TutorialPage } from '@/pages/TutorialPage';
import { DocsPage } from '@/pages/DocsPage';
import { SecurityPage } from '@/pages/SecurityPage';
import { EmbedPage } from '@/pages/EmbedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppShell } from '@/components/app/AppShell';
import { useApp } from '@/lib/store';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, onboardingComplete } = useApp();
  if (!user) return <Redirect to="/login" />;
  if (!onboardingComplete) return <Redirect to="/onboarding/welcome" />;
  return <>{children}</>;
}

function RequirePremium({
  children,
  reason,
}: {
  children: React.ReactNode;
  reason: string;
}) {
  const { plan, openPaywall } = useApp();
  useEffect(() => {
    if (plan === 'starter') openPaywall(reason);
  }, [plan, openPaywall, reason]);
  if (plan === 'starter') return <Redirect to="/app" />;
  return <>{children}</>;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function AppArea() {
  return (
    <RequireAuth>
      <AppShell>
        <Switch>
          <Route path="/app/knowledge" component={KnowledgePage} />
          <Route path="/app/playground" component={PlaygroundPage} />
          <Route path="/app/builder">
            <RequirePremium reason="The embed builder is on the Research plan. Customize the widget and copy the embed code.">
              <BuilderPage />
            </RequirePremium>
          </Route>
          <Route path="/app/widget">
            <Redirect to="/app/builder" />
          </Route>
          <Route path="/app/analytics">
            <RequirePremium reason="Analytics is on the Research plan. It shows questions asked, accuracy, and sources cited.">
              <AnalyticsPage />
            </RequirePremium>
          </Route>
          <Route path="/app/billing" component={BillingPage} />
          <Route path="/app/settings" component={SettingsPage} />
          <Route path="/app" component={OverviewPage} />
        </Switch>
      </AppShell>
    </RequireAuth>
  );
}

export default function App() {
  const [location] = useLocation();
  const inApp = location === '/app' || location.startsWith('/app/');
  const isEmbed = location === '/embed' || location.startsWith('/embed');

  useEffect(() => {
    document.documentElement.classList.toggle('app-locked', inApp);
    return () => document.documentElement.classList.remove('app-locked');
  }, [inApp]);

  return (
    <>
      <ScrollToTop />
      {isEmbed ? (
        <EmbedPage />
      ) : inApp ? (
        <AppArea />
      ) : (
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/tutorial" component={TutorialPage} />
          <Route path="/docs" component={DocsPage} />
          <Route path="/security" component={SecurityPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/onboarding/:step" component={OnboardingRouter} />
          <Route path="/onboarding">
            <Redirect to="/onboarding/welcome" />
          </Route>
          <Route component={NotFoundPage} />
        </Switch>
      )}
    </>
  );
}
