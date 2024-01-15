import { createEvent } from 'effector';
import { $enabledGenes } from 'entities/enabled-genes';
import { $world } from 'entities/world';

import type { GeneName } from 'shared/lib/genome';

export const resetEnabledGenes = createEvent();
export const disableAllGenes = createEvent();
export const addGene = createEvent<GeneName>();
export const removeGene = createEvent<GeneName>();

$enabledGenes
  .on(disableAllGenes, () => [])
  .on(addGene, (value, gene) => [...value, gene])
  .on(removeGene, (value, gene) => value.filter((g) => g !== gene))
  .reset(resetEnabledGenes)
  .watch((value) => $world.getState().genePool = value);
