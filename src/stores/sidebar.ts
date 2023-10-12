import { makeAutoObservable } from 'mobx';

class SidebarStore {
  isOpen = false;
  constructor() {
    makeAutoObservable(this);
  }

  open = () => this.isOpen = true;
  close = () => this.isOpen = false;
  toggle = () => this.isOpen = !this.isOpen;
}

export const sidebarStore = new SidebarStore();
export { type SidebarStore };
