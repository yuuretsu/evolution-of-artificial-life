import { createEvent, createStore } from 'effector';

export const setImageOffset = createEvent<{ x: number; y: number }>();

export const resetImageOffset = setImageOffset.prepend(() => ({ x: 0, y: 0 }));

export const $imageOffset = createStore({ x: 0, y: 0 }).on(setImageOffset, (_, { x, y }) => ({ x, y }));
