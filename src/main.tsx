import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update for offline capabilities
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('PWA: New content available, reloading...');
  },
  onOfflineReady() {
    console.log('PWA: App ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
