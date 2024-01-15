import type { SquareWorld } from 'shared/lib/world/world';
import type { CanGetColor } from './can-get-color';
import type { CanInteract } from './can-interact';
import type { FC } from 'react';

export interface BaseWorldBlock extends CanGetColor, CanInteract {
  age: number;
  Render: FC;
}

export interface WorldBlockStatic extends BaseWorldBlock {
  isDynamic: false;
}

export interface WorldBlockDynamic extends BaseWorldBlock {
  isDynamic: true;
  live(x: number, y: number, world: SquareWorld): void;
}

export type WorldBlock = WorldBlockStatic | WorldBlockDynamic;
