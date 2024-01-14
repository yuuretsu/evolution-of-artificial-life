import { MAX_STEP_TIME_MS } from 'shared/settings';
import { connectForm } from 'shared/lib/helpers';
import { createEvent, createStore } from 'effector';

export const setMinTimeBetweenUpdates = createEvent<number>();

export const $minTimeBetweenUpdates = createStore(0)
  .on(setMinTimeBetweenUpdates, (_, value) => value);


export const formMinTimeBetweenUpdates = connectForm(
  $minTimeBetweenUpdates,
  x => String(MAX_STEP_TIME_MS - x),
  x => MAX_STEP_TIME_MS - +x
);
