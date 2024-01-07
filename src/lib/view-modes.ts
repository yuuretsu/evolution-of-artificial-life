import { Rgba } from './color';
import { GENES_ARR } from './genome/genes';

import type { WorldBlock } from 'types';

export type VisualiserParams = {
  ageDivider: number;
  energyDivider: number;
  action: string[];
};

export type BlockVisualiser = (
  block: WorldBlock,
  params: VisualiserParams
) => Rgba | null;

export type ViewMode = {
  name: string;
  blockToColor: BlockVisualiser;
};

export const VIEW_MODES: Record<string, ViewMode> = {
  informative: {
    name: 'Информативный',
    blockToColor: (block) => block.getInformativeColor(),
  },
  normal: {
    name: 'Простой',
    blockToColor: (block) => block.getJustColor(),
  },
  family: {
    name: 'Семейства',
    blockToColor: (block) => block.getFamilyColor(),
  },
  age: {
    name: 'Возраст',
    blockToColor: (block, params) => {
      return block.getAgeColor(params);
    },
  },
  energy: {
    name: 'Энергия',
    blockToColor: (block, params) => {
      return block.getEnergyColor(params);
    },
  },
  lastAction: {
    name: 'Последнее действие',
    blockToColor: (block, params) => {
      return (
        block
          .getLastActionColor(params)
          ?.lerp(new Rgba(127, 127, 127, 255), 0.25) || null
      );
    },
  },
  childrenAmount: {
    name: 'Количество потомков',
    blockToColor: (block) => {
      return block.getChildrenAmountColor();
    },
  },
  ability: {
    name: 'Специализация в питании',
    blockToColor: (block) => {
      return block.getAbilityColor();
    },
  },
  health: {
    name: 'Здоровье',
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

export const VISIBLE_GENES = GENES_ARR.filter(gene => gene.color);

export const initVisualizerParams: VisualiserParams = {
  ageDivider: 1000,
  energyDivider: 100,
  action: VISIBLE_GENES.map(({ id }) => id),
};
