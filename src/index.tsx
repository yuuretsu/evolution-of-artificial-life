import { createRoot } from 'react-dom/client';
import { registerServiceWorker } from 'registerSW';

import { App } from './App';

import './index.css';

registerServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);
