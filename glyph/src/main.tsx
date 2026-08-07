import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from '@/App';
import { AppProvider } from '@/lib/store';
import { ThemeProvider, useTheme } from '@/lib/theme';
import '@/index.css';

function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      theme={theme}
      duration={1400}
      toastOptions={{
        className:
          theme === 'dark'
            ? '!bg-zinc-900 !border !border-white/10 !shadow-[0_12px_40px_rgba(0,0,0,0.45)] !text-zinc-50'
            : '!bg-white !border !border-black/10 !shadow-[0_12px_40px_rgba(0,0,0,0.1)] !text-black',
        duration: 1400,
      }}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AppProvider>
      <App />
      <ThemedToaster />
    </AppProvider>
  </ThemeProvider>,
);
