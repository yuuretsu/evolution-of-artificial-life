import { makeAutoObservable } from 'mobx';
import { ToggleStore } from 'stores';

class SidebarStore {
  isOpenStore = new ToggleStore(false);

  constructor() {
    makeAutoObservable(this);
  }

  get isOpen() {
    return this.isOpenStore.state;
  }

  open = this.isOpenStore.setTrue;
  close = this.isOpenStore.setFalse;
  toggle = this.isOpenStore.toggle;
}

export const sidebarStore = new SidebarStore();
export { type SidebarStore };
