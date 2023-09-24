import './index.css';

import { createRoot } from 'react-dom/client';
import { sendUserInfoToTelegram } from 'analytics';

import { App } from './App';

sendUserInfoToTelegram();

createRoot(document.getElementById('root')!).render(<App />);
