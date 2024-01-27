import { createRoot } from 'react-dom/client';

import { sendUserInfoToTelegram } from './model/analytics';
import { App } from './ui/app';

sendUserInfoToTelegram();

createRoot(document.getElementById('root')!).render(<App />);
