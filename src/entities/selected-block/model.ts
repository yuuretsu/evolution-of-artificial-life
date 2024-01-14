import { createStore } from 'effector';

import type { WorldBlock } from 'types';

export const $selectedBlock = createStore<WorldBlock | null>(null);
