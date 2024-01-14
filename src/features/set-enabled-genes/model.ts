import { createEffect, createEvent } from 'effector';
import { $enabledGenes } from 'entities/enabled-genes';
import { $world } from 'entities/world';

import type { GeneName } from 'lib/genome';

// export const setEnabledGenes = createEvent<GeneName[]>();
export const setEnabledGenes = createEffect((genesNames: GeneName[]) => {
  $world.getState().genePool = genesNames;
});
export const resetEnabledGenes = createEvent();
export const disableAllGenes = createEvent();
export const addGene = createEvent<GeneName>();
export const removeGene = createEvent<GeneName>();

$enabledGenes
  .on(setEnabledGenes, (_, value) => value)
  .on(disableAllGenes, () => [])
  .on(addGene, (value, gene) => [...value, gene])
  .on(removeGene, (value, gene) => value.filter((g) => g !== gene))
  .reset(resetEnabledGenes);
