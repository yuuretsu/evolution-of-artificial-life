import { GENE_CELL_SIZE_PX } from 'settings';
import { Rgba } from 'lib/color';

import type { GeneCellState } from './types';

export const getBorderColor = (state: GeneCellState) => {
  return {
    notActive: 'none',
    active: `${GENE_CELL_SIZE_PX / 10}px solid white`,
    recentlyUsed: `${GENE_CELL_SIZE_PX / 15}px solid rgba(255, 255, 255, 0.5)`,
  }[state];
};

export const getBackgroundColor = (state: GeneCellState, color?: Rgba) => {
  if (!color) return 'rgba(127, 127, 127, 0.1)';
  const rgba = state === 'active' ? color : color.lerp(new Rgba(50, 50, 50, 127), 0.75);
  return rgba.toString();
};

export const getSize = (state: GeneCellState) => {
  const sizePx = state === 'active' ? GENE_CELL_SIZE_PX * 0.9 : GENE_CELL_SIZE_PX * 0.6;
  return `${sizePx}px`;
};
