import { createRoot } from 'react-dom/client';
import { sendUserInfoToTelegram } from 'analytics';

import { App } from '.';

sendUserInfoToTelegram();

createRoot(document.getElementById('root')!).render(<App />);
