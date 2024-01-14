import { observer } from 'mobx-react';
import { Accordion } from 'ui';
import { SetEnabledGenes } from 'features/set-enabled-genes';
import { useAccordionToggle } from 'lib/hooks';
import { createToggleStore } from 'lib/helpers';

import type { FC } from 'react';

export const CurrentWorldSettings: FC = observer(() => {
  const accordionProps = useAccordionToggle(
    currentWorldSettingsAccordionState.$isEnabled,
    currentWorldSettingsAccordionState.toggle
  );

  return (
    <Accordion name='Настройки мира' {...accordionProps}>
      <SetEnabledGenes />
    </Accordion>
  );
});

const currentWorldSettingsAccordionState = createToggleStore(false);
