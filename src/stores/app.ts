import VIEW_MODES from "lib/view-modes";
import { makeAutoObservable } from "mobx";

class AppStore {
  isPaused = false;

  viewMode: string = Object.keys(VIEW_MODES)[0] || "";

  constructor() {
    makeAutoObservable(this);
  }

  play = () => this.isPaused = false;
  pause = () => this.isPaused = true;
  toggleIsPaused = () => this.isPaused = !this.isPaused;
}

export const appStore = new AppStore();
export { type AppStore };
