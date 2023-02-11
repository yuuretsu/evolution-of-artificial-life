import { makeAutoObservable } from "mobx";

export class ValueStore<T> {
  private _value: T;

  constructor(value: T) {
    this._value = value;
    makeAutoObservable(this);
  }

  get current() {
    return this._value;
  }

  set = (newValue: T) => this._value = newValue;
}

export class ToggleStore {
  private _state: boolean;

  constructor(state: boolean) {
    this._state = state;
    makeAutoObservable(this);
  }

  get state() {
    return this._state;
  }

  setTrue = () => this._state = true;
  setFalse = () => this._state = false;
  toggle = () => this._state = !this._state;
}
