import { VIEW_MODES } from 'lib/view-modes';
import { makeAutoObservable } from 'mobx';
import { ValueStore } from 'stores';

class AppStore {
  // Defaulting to paused if in development mode
  isPaused = import.meta.env.DEV;

  isShowUpdateBtn = new ValueStore(false);

  timeBetweenSteps = new ValueStore(0);

  viewModeName = new ValueStore<string>(Object.keys(VIEW_MODES)[0] || '');

  imageOffset = new ValueStore({ x: 0, y: 0 });

  constructor() {
    makeAutoObservable(this);
  }

  play = () => this.isPaused = false;
  pause = () => this.isPaused = true;
  toggleIsPaused = () => this.isPaused = !this.isPaused;
}

export const appStore = new AppStore();
export { type AppStore };
