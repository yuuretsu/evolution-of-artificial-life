import { Rgba } from 'lib/color';
import { Bot } from 'lib/bot';
import { World } from 'lib/world';

export type GeneTemplate = {
  name: string,
  description?: string,
  defaultEnabled: boolean,
  color: Rgba | null,
  colorInfluence: number | null,
  action: (parameters: GeneParameters) => ActionResult
};

export type GeneProperty = {
  option: number,
  branches: [number, number]
};

export type GenePool = GeneTemplate[];

export type ActionResult = {
  completed: boolean,
  goto: number | null,
  msg: string
};

export type GeneParameters = {
  bot: Bot,
  x: number,
  y: number,
  world: World,
  property: GeneProperty
};
