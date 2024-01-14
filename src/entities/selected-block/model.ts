import { createStore } from 'effector';

import type { WorldBlock } from 'shared/types';

export const $selectedBlock = createStore<WorldBlock | null>(null);
