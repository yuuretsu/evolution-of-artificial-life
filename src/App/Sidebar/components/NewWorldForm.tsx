import { Accordion } from 'ui';
import { StartNewWorld } from 'features/start-new-world/ui';
import { createToggleStore } from 'lib/helpers';
import { useAccordionToggle } from 'lib/hooks';

import type { FC } from 'react';

export const NewWorldForm: FC = () => {
  const restartWorldAccordionProps = useAccordionToggle(
    restartWorldAccordionState.$isEnabled,
    restartWorldAccordionState.toggle
  );

  return (
    <Accordion name='Перезапуск' {...restartWorldAccordionProps}>
      <StartNewWorld />
    </Accordion>
  );
};

const restartWorldAccordionState = createToggleStore(false);
