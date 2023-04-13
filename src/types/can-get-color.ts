import Rgba from "lib/color";
import { VisualiserParams } from "lib/view-modes";

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