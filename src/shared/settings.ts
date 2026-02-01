// SIDEBAR
export const SIDEBAR_WIDTH_PX = 260;
// export const SIDEBAR_PADDING_PX = 20;
export const SIDEBAR_PADDING_PX_X = 24;
export const SIDEBAR_PADDING_PX_Y = 16;
export const SIDEBAR_ANIMATION_SPEED = '0.2s';

// VIEW
export const PIXEL_SIZE = 10;
export const MAX_STEP_TIME_MS = 200;

// GENOME VIEW
export const GENOME_VIEW_BORDER_PX = 2;
const GENOME_VIEW_GENES_IN_ROW = 8;

// BOT
export const MAX_ACTIONS = 8;
export const MAX_BOT_AGE = 2000;
export const MAX_BOT_ENERGY = 300;

export const GENE_CELL_SIZE_PX =
  (SIDEBAR_WIDTH_PX - GENOME_VIEW_BORDER_PX * 2) /
  GENOME_VIEW_GENES_IN_ROW;
export const SIDEBAR_WIDTH = `${SIDEBAR_WIDTH_PX}px`;
// export const SIDEBAR_PADDING = `${SIDEBAR_PADDING_PX}px`;
export const SIDEBAR_PADDING_X = `${SIDEBAR_PADDING_PX_X}px`;
export const SIDEBAR_PADDING_Y = `${SIDEBAR_PADDING_PX_Y}px`;