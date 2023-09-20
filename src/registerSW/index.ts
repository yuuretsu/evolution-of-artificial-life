import { appStore } from 'stores/app';
import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  registerSW({
    onNeedRefresh: () => {
      appStore.isShowUpdateBtn.set(true);
    },
    onRegisteredSW: () => {
      appStore.isShowUpdateBtn.set(true);
    },
    onOfflineReady: () => {
      console.log(123);

    }
  });
};
