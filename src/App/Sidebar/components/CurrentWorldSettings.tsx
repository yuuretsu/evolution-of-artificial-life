import { Accordion } from 'shared/ui';
import { SetEnabledGenes } from 'features/set-enabled-genes';
import { useAccordionToggle } from 'shared/lib/hooks';
import { createToggleStore } from 'shared/lib/helpers';

import type { FC } from 'react';

export const CurrentWorldSettings: FC = () => {
  const accordionProps = useAccordionToggle(
    currentWorldSettingsAccordionState.$isEnabled,
    currentWorldSettingsAccordionState.toggle
  );

  return (
    <Accordion name='Настройки мира' {...accordionProps}>
      <SetEnabledGenes />
    </Accordion>
  );
};

const currentWorldSettingsAccordionState = createToggleStore(false);
