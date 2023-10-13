import { makeAutoObservable } from 'mobx';
import { ToggleStore } from 'stores';
import { GENES_NAMES } from 'lib/genome/genes';

import type { GeneName } from 'lib/genome';

const LEGEND_PREFIX = 'legend::';

type AccordionStateGeneName<T extends GeneName> = `${typeof LEGEND_PREFIX}${T}`;

const LEGEND_ACCORDIONS_STORES = GENES_NAMES
  .reduce((acc, geneName) => ({
    ...acc,
    [`${LEGEND_PREFIX}${geneName}`]: new ToggleStore(false)
  }), {}) as Record<AccordionStateGeneName<GeneName>, ToggleStore>;

interface AccordionsStatesGetPropsOptions {
  onToggle: () => void;
}

const DEFAULT_ACCORDIONS_STATES_GET_PROPS_OPTIONS: AccordionsStatesGetPropsOptions = {
  onToggle: () => void 0,
};

export class AccordionsStates {
  readonly states = {
    legend: new ToggleStore(false),
    ...LEGEND_ACCORDIONS_STORES,
    worldInfo: new ToggleStore(true),
    worldBlockInfo: new ToggleStore(true),
    lastActions: new ToggleStore(false),
    gene: new ToggleStore(true),
    genome: new ToggleStore(true),
    viewSettings: new ToggleStore(true),
    worldSettings: new ToggleStore(true),
    restartWorld: new ToggleStore(true),
  } as const;

  constructor() {
    makeAutoObservable(this);
  }

  getProps = (name: keyof AccordionsStates['states'], options?: AccordionsStatesGetPropsOptions) => {
    const _options = { ...DEFAULT_ACCORDIONS_STATES_GET_PROPS_OPTIONS, ...options };
    const toggleStore = this.states[name];
    const handleToggle = () => {
      toggleStore.toggle();
      _options.onToggle();
    };
    return {
      isOpen: toggleStore.state,
      onToggle: handleToggle,
    };
  };
}

export const accordionsStates = new AccordionsStates();
