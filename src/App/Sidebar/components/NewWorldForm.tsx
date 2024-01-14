import { Accordion } from 'shared/ui';
import { StartNewWorld } from 'features/start-new-world/ui';
import { createToggleStore } from 'shared/lib/helpers';
import { useAccordionToggle } from 'shared/lib/hooks';

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
