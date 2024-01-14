import { createEvent, createStore } from 'effector';
import { VIEW_MODES } from 'lib/view-modes';


export const setViewMode = createEvent<string>();

export const $viewMode = createStore<string>(Object.keys(VIEW_MODES)[0]!)
  .on(setViewMode, (_, mode) => mode);
