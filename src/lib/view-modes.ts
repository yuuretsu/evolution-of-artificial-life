import Rgba from "./color";
import { interpolate } from "./helpers";
import { WorldBlock } from "./block";
import { GENES } from "./genome";
import { Key } from "react";

export type VisualiserParams = {
    ageDivider: number;
    energyDivider: number,
    action: { [name: string]: boolean }
};

export type BlockVisualiser = (block: WorldBlock, params: VisualiserParams) => Rgba | null;

export type ViewMode = {
    name: string,
    blockToColor: BlockVisualiser
};

const VIEW_MODES: { [key: string]: ViewMode } = {
    normal: {
        name: 'Стандартный',
        blockToColor: (block, params) => block.color,
    },
    age: {
        name: 'Возраст',
        blockToColor: (block, params) => {
            // const AGE = block.age;
            // if (AGE === null) return new Rgba(40, 40, 40, 255);
            // const VAL = interpolate(20, 255, AGE / params.ageDivider);
            // return new Rgba(VAL, VAL, VAL, 255);
            return block.getAgeColor(params);
        },
    },
    energy: {
        name: 'Энергия',
        blockToColor: (block, params) => {
            // const ENERGY = block.energy;
            // if (ENERGY === null) return new Rgba(40, 40, 40, 255);
            // return new Rgba(0, 0, 100, 255)
            //     .interpolate(new Rgba(255, 255, 0, 255), ENERGY / params.energyDivider);
            return block.getEnergyColor(params);
        },
    },
    lastAction: {
        name: 'Последнее действие',
        blockToColor: (block, params) => {
            return block.getLastActionColor(params);
        },
    },
    childrenAmount: {
        name: 'Количество потомков',
        blockToColor: (block, params) => {
            return block.getChildrenAmountColor(params);
        },
    },
    ability: {
        name: 'Специализация в питании',
        blockToColor: (block, params) => {
            return block.getAbilityColor();
        },
    },
    health: {
        name: 'Здоровье',
        blockToColor: (block, params) => {
            return block.getHealthColor();
        },
    },
};

export default VIEW_MODES;