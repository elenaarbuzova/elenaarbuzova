import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from '@/App';
import { AppProvider } from '@/lib/store';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <App />
    <Toaster
      position="bottom-right"
      theme="light"
      duration={1400}
      toastOptions={{
        className:
          '!bg-white !border !border-black/10 !shadow-[0_12px_40px_rgba(0,0,0,0.1)] !text-black',
        duration: 1400,
      }}
    />
  </AppProvider>,
);
