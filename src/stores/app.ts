import { VIEW_MODES } from 'lib/view-modes';
import { makeAutoObservable } from 'mobx';
import { ToggleStore, ValueStore } from 'stores';

class AppStore {
  // Defaulting to paused if in development mode
  isPausedStore = new ToggleStore(import.meta.env.DEV === true);
  timeBetweenSteps = new ValueStore(0);
  viewModeName = new ValueStore<string>(Object.keys(VIEW_MODES)[0] || '');
  imageOffset = new ValueStore({ x: 0, y: 0 });

  constructor() {
    makeAutoObservable(this);
  }

  get isPaused() {
    return this.isPausedStore.state;
  }

  play = this.isPausedStore.setFalse;
  pause = this.isPausedStore.setTrue;
  toggleIsPaused = this.isPausedStore.toggle;
}

export const appStore = new AppStore();
export { type AppStore };
