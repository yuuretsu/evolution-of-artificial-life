import Rgba from "./color";
import { interpolate } from "./helpers";
import { WorldBlock } from "./block";
import { GENES } from "./genome";
import { Key } from "react";

export type VisualiserParams = {
  ageDivider: number;
  energyDivider: number;
  action: { [name: string]: boolean };
};

export type BlockVisualiser = (
  block: WorldBlock,
  params: VisualiserParams
) => Rgba | null;

export type ViewMode = {
  name: string;
  blockToColor: BlockVisualiser;
};

const VIEW_MODES: { [key: string]: ViewMode } = {
  normal: {
    name: "Стандартный",
    blockToColor: (block, params) => block.color,
  },
  family: {
    name: "Семейства",
    blockToColor: (block, params) => block.getFamilyColor(),
  },
  age: {
    name: "Возраст",
    blockToColor: (block, params) => {
      return block.getAgeColor(params);
    },
  },
  energy: {
    name: "Энергия",
    blockToColor: (block, params) => {
      return block.getEnergyColor(params);
    },
  },
  lastAction: {
    name: "Последнее действие",
    blockToColor: (block, params) => {
      return (
        block
          .getLastActionColor(params)
          ?.interpolate(new Rgba(127, 127, 127, 255), 0.25) || null
      );
    },
  },
  childrenAmount: {
    name: "Количество потомков",
    blockToColor: (block, params) => {
      return block.getChildrenAmountColor(params);
    },
  },
  ability: {
    name: "Специализация в питании",
    blockToColor: (block, params) => {
      return block.getAbilityColor();
    },
  },
  health: {
    name: "Здоровье",
    blockToColor: (block, params) => {
      return block.getHealthColor();
    },
  },
};

export default VIEW_MODES;
