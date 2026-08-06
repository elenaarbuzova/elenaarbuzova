import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useApp } from '@/lib/store';

/** Opens the settings dialog and returns to the previous app surface. */
export function SettingsPage() {
  const { openSettings } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    openSettings();
    setLocation('/app');
  }, [openSettings, setLocation]);

  return null;
}
