import type { SquareWorld } from '../world/world';
import type { Bot } from 'shared/lib/bot';
import type { Rgba } from 'shared/lib/color';

type GeneTemplateBase = {
  id: string,
  name: string,
  description?: string,
  color?: Rgba,
  isDefaultDisabled?: boolean,
  action: (parameters: GeneParameters) => ActionResult,
  translation?: {
    option?: string,
    branches?:
    | readonly [string, string]
    | readonly [string]
  },
}

type GeneTemplateWithColorInfluence = GeneTemplateBase & {
  colorInfluence: number;
  color: Rgba
}

export type GeneTemplate =
  | GeneTemplateBase
  | GeneTemplateWithColorInfluence;

export type GeneProperty = {
  option: number,
  branches: [number, number]
};

export type GenePool = GeneTemplate[];

export type ActionResult = {
  isCompleted?: boolean,
  goto?: number,
  msg: string
};

export type GeneParameters = {
  bot: Bot,
  x: number,
  y: number,
  world: SquareWorld,
  property: GeneProperty
};
