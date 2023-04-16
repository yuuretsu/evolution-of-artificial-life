import { makeAutoObservable } from 'mobx';

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

export class FormStore<T extends Record<string, unknown>> {
  private _values: T;

  constructor(init: () => T) {
    this._values = init();
  }

  get values() {
    return { ...this._values };
  }

  setValue = <Key extends keyof T>(value: T[Key], key: Key) => {
    this._values[key] = value;
  };

  setValues = (values: Partial<T>) => {
    this._values = { ...this._values, ...values };
  };
}