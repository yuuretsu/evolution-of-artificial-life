import { createRoot } from 'react-dom/client';

import { sendUserInfoToTelegram } from './model/analytics';

import { App } from '.';

sendUserInfoToTelegram();

createRoot(document.getElementById('root')!).render(<App />);
