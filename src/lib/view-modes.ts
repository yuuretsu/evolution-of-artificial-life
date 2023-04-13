import Rgba from "./color";
import { GENES } from "./genome";
import { TWorldBlock } from "types";

export type VisualiserParams = {
  ageDivider: number;
  energyDivider: number;
  action: { [name: string]: boolean };
};

export type BlockVisualiser = (
  block: TWorldBlock,
  params: VisualiserParams
) => Rgba | null;

export type ViewMode = {
  name: string;
  blockToColor: BlockVisualiser;
};

const VIEW_MODES: { [key: string]: ViewMode } = {
  normal: {
    name: "Обычный",
    blockToColor: (block) => block.getNormalColor(),
  },
  informative: {
    name: "Информативный",
    blockToColor: (block) => block.getNormalColor(),
  },
  family: {
    name: "Семейства",
    blockToColor: (block) => block.getFamilyColor(),
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
    blockToColor: (block) => {
      return block.getChildrenAmountColor();
    },
  },
  ability: {
    name: "Специализация в питании",
    blockToColor: (block) => {
      return block.getAbilityColor();
    },
  },
  health: {
    name: "Здоровье",
    blockToColor: (block, params) => {
      return block.getHealthColor(params);
    },
  },
};

export const viewModesList = Object
  .keys(VIEW_MODES)
  .map(key => {
    return {
      value: key,
      title: VIEW_MODES[key]!.name
    };
  });

export const initVisualizerParams: VisualiserParams = {
  ageDivider: 1000,
  energyDivider: 100,
  action: Object.keys(GENES).reduce((action, geneName) => {
    return GENES[geneName]?.color === null
      ? action
      : {
        ...action,
        [GENES[geneName]!.name]: true
      }
  }, {})
};

export default VIEW_MODES;
