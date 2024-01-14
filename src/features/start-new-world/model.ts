import { combine, createEvent, createStore, sample } from 'effector';
import { $world } from 'entities/world';
import { SquareWorld } from 'lib/world';
import { $enabledGenes } from 'entities/enabled-genes';
import { PIXEL_SIZE } from 'settings';
import { $selectedBlock } from 'entities/selected-block';
import { resetImageOffset } from 'entities/image-offset';
import { connectForm } from 'lib/helpers';

import type { NewWorldProps } from 'lib/world';
import type { Store } from 'effector';



const startNewWorld = createEvent<NewWorldProps>();
export const startNewWorldWithCurrentParameters = createEvent();

$world.on(startNewWorld, (_, props) => new SquareWorld(props));
$selectedBlock.on(startNewWorld, () => null);

const initWidth = Math.max(Math.floor(window.innerWidth / PIXEL_SIZE) + 2, 10);
const initHeight = Math.max(Math.floor(window.innerHeight / PIXEL_SIZE) + 2, 10);

const $newWorldWidth = createStore(initWidth);
const $newWorldHeight = createStore(initHeight);
const $newWorldBotsAmount = createStore(initWidth * initHeight);
const $newWorldGenomeSize = createStore(32);

export const formNewWorldWidth = connectForm($newWorldWidth, String, Number);
export const formNewWorldHeight = connectForm($newWorldHeight, String, Number);
export const formNewWorldBotsAmount = connectForm($newWorldBotsAmount, String, Number);
export const formNewWorldGenomeSize = connectForm($newWorldGenomeSize, String, Number);

const $newWorldForm: Store<NewWorldProps> = combine({
  width: $newWorldWidth,
  height: $newWorldHeight,
  botsAmount: $newWorldBotsAmount,
  genomeSize: $newWorldGenomeSize,
  genePool: $enabledGenes,
});

const $worldSize = combine({ width: $newWorldWidth, height: $newWorldHeight });

sample({
  clock: $worldSize,
  fn: ({ width, height }) => width * height,
  target: $newWorldBotsAmount
});

sample({
  clock: $newWorldBotsAmount,
  source: $worldSize,
  fn: ({ width, height }, amount) => Math.min(amount, width * height),
  target: $newWorldBotsAmount,
});

sample({
  clock: startNewWorldWithCurrentParameters,
  source: $newWorldForm,
  target: startNewWorld
});

sample({
  clock: startNewWorld,
  target: resetImageOffset
});
