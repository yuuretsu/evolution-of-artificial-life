import { createEvent, createStore, sample } from 'effector';
import { INITIALLY_ENABLED_GENES_NAMES } from 'shared/lib/genome/genes';
import { PIXEL_SIZE } from 'shared/settings';
import { SquareWorld } from 'shared/lib/world/world';

import type { WorldInfo, NewWorldProps } from 'shared/lib/world/world';


const initWidth = Math.max(Math.floor(window.innerWidth / PIXEL_SIZE) + 2, 10);
const initHeight = Math.max(Math.floor(window.innerHeight / PIXEL_SIZE) + 2, 10);

const INIT_WORLD_PROPS: NewWorldProps = {
  width: initWidth,
  height: initHeight,
  botsAmount: initWidth * initHeight,
  genePool: INITIALLY_ENABLED_GENES_NAMES,
  genomeSize: 32,
};

export const $world = createStore<SquareWorld>(new SquareWorld(INIT_WORLD_PROPS));

export const setWorldInfo = createEvent<WorldInfo>();

export const updateWorldInfo = createEvent();

export const $worldInfo = createStore<WorldInfo>({
  averageAge: 0,
  cycle: 0,
  maxGeneration: 0,
  stepTime: 0,
  dynamicBlocks: 0
});

$worldInfo.on(setWorldInfo, (_, value) => value);

sample({
  clock: updateWorldInfo,
  source: $world,
  fn: (world) => world.getInfo(),
  target: setWorldInfo
});
