import { observer } from 'mobx-react';
import { MAX_STEP_TIME_MS } from 'settings';
import { appStore } from 'stores/app';
import { FlexRow, InputRange } from 'ui';

import type { ChangeEventHandler } from 'react';

export const SimulationSpeedRange = observer(() => {
  const handleChangeSpeed: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = MAX_STEP_TIME_MS - +e.target.value;
    appStore.timeBetweenSteps.set(newValue);
  };

  const value = MAX_STEP_TIME_MS - appStore.timeBetweenSteps.current;

  return (
    <FlexRow gap={5}>
      <InputRange
        min={1}
        max={MAX_STEP_TIME_MS}
        value={value}
        onChange={handleChangeSpeed}
      />
    </FlexRow>
  );
});
