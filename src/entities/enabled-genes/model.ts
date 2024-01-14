import { createStore } from 'effector';
import { INITIALLY_ENABLED_GENES_NAMES } from 'shared/lib/genome/genes';

export const $enabledGenes = createStore(INITIALLY_ENABLED_GENES_NAMES);
