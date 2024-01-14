import { makeAutoObservable } from 'mobx';

export class ToggleStore {
  private isEnabled: boolean;

  constructor(state: boolean) {
    this.isEnabled = state;
    makeAutoObservable(this);
  }

  get state() {
    return this.isEnabled;
  }

  setTrue = () => this.isEnabled = true;
  setFalse = () => this.isEnabled = false;
  toggle = () => this.isEnabled = !this.isEnabled;
}
