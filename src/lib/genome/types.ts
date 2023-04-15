import type { Bot } from 'lib/bot';
import type { Rgba } from 'lib/color';
import type { World } from 'lib/world';

type GeneTemplateBase = {
  name: string,
  description?: string,
  defaultEnabled: boolean,
  action: (parameters: GeneParameters) => ActionResult
}

type GeneTemplateWithColorInfluence = GeneTemplateBase & {
  colorInfluence: number;
  color: Rgba
}

type GeneTemplateWithoutColorInfluence = GeneTemplateBase & {
  colorInfluence: null;
  color: Rgba | null,
}

export type GeneTemplate =
  | GeneTemplateWithoutColorInfluence
  | GeneTemplateWithColorInfluence;

export type GeneProperty = {
  option: number,
  branches: [number, number]
};

export type GenePool = GeneTemplate[];

export type ActionResult = {
  completed?: boolean,
  goto?: number,
  msg: string
};

export type GeneParameters = {
  bot: Bot,
  x: number,
  y: number,
  world: World,
  property: GeneProperty
};
