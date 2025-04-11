import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { AudioProvider } from './components/BackgroundMusic';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { AnalyticsProvider } from './components';
import './index.css';

// Import Firebase - this ensures Firebase is initialized
import './lib/firebase';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <AnalyticsProvider>
        <LanguageProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </LanguageProvider>
      </AnalyticsProvider>
    </FirebaseProvider>
  </StrictMode>
);