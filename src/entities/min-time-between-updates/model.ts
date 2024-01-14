import { createEvent, createStore } from 'effector';

export const setMinTimeBetweenUpdates = createEvent<number>();

export const $minTimeBetweenUpdates = createStore(0)
  .on(setMinTimeBetweenUpdates, (_, value) => value);
