import Rgba from "lib/color";
import { Bot } from "lib/bot";
import { World } from "lib/world";

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

export type ActionResult =
  | { completed: false, goto: number | null }
  | { completed: true, goto: number | null, msg: string };

export type GeneParameters = {
  bot: Bot,
  x: number,
  y: number,
  world: World,
  property: GeneProperty
};
