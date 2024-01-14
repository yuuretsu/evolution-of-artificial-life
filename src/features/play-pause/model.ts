import { createEvent, sample } from 'effector';
import { $isPlaying } from 'entities/play-pause';

export const setIsPlaying = createEvent<boolean>();
export const play = createEvent();
export const pause = createEvent();
export const toggleIsPlaying = createEvent();

$isPlaying.on(setIsPlaying, (_, value) => value);

sample({
  clock: play,
  fn: () => true,
  target: setIsPlaying
});

sample({
  clock: pause,
  fn: () => false,
  target: setIsPlaying
});

sample({
  clock: toggleIsPlaying,
  source: $isPlaying,
  fn: (isPlaying) => !isPlaying,
  target: setIsPlaying
});
