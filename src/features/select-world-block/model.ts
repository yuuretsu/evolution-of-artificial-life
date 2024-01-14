import { createEvent } from 'effector';
import { $selectedBlock } from 'entities/selected-block';

import type { WorldBlock } from 'shared/types';

export const selectWorldBlock = createEvent<WorldBlock | null>();

$selectedBlock.on(selectWorldBlock, (_, value) => value);
