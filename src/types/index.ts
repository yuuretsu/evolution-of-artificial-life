import { Bot } from "lib/bot";
import Rgba from "lib/color";
import { GenePool } from "lib/genome";
import { VisualiserParams } from "lib/view-modes";
import { World } from "lib/world";
import { FC } from "react";

export interface GetColorFn<T extends unknown[] = []> {
  (...args: T): Rgba | null;
}

export type TGetColorWithParamsFn = GetColorFn<[VisualiserParams]>;

export interface CanGetColor {
  getJustColor: GetColorFn;
  getInformativeColor: GetColorFn;
  getFamilyColor: GetColorFn;
  getEnergyColor: TGetColorWithParamsFn;
  getAgeColor: TGetColorWithParamsFn;
  getLastActionColor: TGetColorWithParamsFn;
  getChildrenAmountColor: GetColorFn;
  getAbilityColor: GetColorFn;
  getHealthColor: TGetColorWithParamsFn;
}

export interface CanInteract {
  onAttack(bot: Bot, value: number): number;
  onVirus(bot: Bot, pool: GenePool): void;
}

export interface BaseWorldBlock extends CanGetColor, CanInteract {
  age: number | null;
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
