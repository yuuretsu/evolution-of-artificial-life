import { World } from 'lib/world';
import { FC } from 'react';
import { CanGetColor } from './can-get-color';
import { CanInteract } from './can-interact';

export interface BaseWorldBlock extends CanGetColor, CanInteract {
  age: number;
  Render: FC;
}

export interface WorldBlockStatic extends BaseWorldBlock {
  isDynamic: false;
}

export interface WorldBlockDynamic extends BaseWorldBlock {
  isDynamic: true;
  live(x: number, y: number, world: World): void;
}

export type WorldBlock = WorldBlockStatic | WorldBlockDynamic;
