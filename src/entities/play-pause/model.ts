import { createStore } from 'effector';

export const $isPlaying = createStore(import.meta.env.DEV === false);
export const $isPaused = $isPlaying.map((isPlaying) => !isPlaying);
