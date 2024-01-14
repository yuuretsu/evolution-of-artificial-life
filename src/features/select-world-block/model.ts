import { createEvent } from 'effector';
import { $selectedBlock } from 'entities/selected-block';

import type { WorldBlock } from 'types';

export const selectWorldBlock = createEvent<WorldBlock | null>();

$selectedBlock.on(selectWorldBlock, (_, value) => value);
