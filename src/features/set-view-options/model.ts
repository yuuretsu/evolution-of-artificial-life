import { combine, createEvent, createStore } from 'effector';
import { connectForm } from 'shared/lib/helpers';
import { VIEW_MODES, VISIBLE_GENES } from 'shared/lib/view-modes';

import type { GeneName } from 'shared/lib/genome';
import type { VisualiserParams } from 'shared/lib/view-modes';
import type { Store } from 'effector';


export const setViewMode = createEvent<string>();

export const $viewMode = createStore<string>(Object.keys(VIEW_MODES)[0]!)
  .on(setViewMode, (_, mode) => mode);

export const $ageDivider = createStore(1000);
export const $energyDivider = createStore(100);

export const setEnabledLastActions = createEvent<GeneName[]>();

export const $enabledLastActions = createStore(VISIBLE_GENES.map(({ id }) => id)).on(
  setEnabledLastActions,
  (_, value) => value
);

export const formAgeDivider = connectForm(
  $ageDivider,
  String,
  Number
);

export const formEnergyDivider = connectForm(
  $energyDivider,
  String,
  Number
);

export const $visualizerParams: Store<VisualiserParams> = combine({
  ageDivider: $ageDivider,
  energyDivider: $energyDivider,
  action: $enabledLastActions,
});
