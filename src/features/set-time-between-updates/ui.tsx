import { MAX_STEP_TIME_MS } from 'settings';
import { FlexRow, InputRange } from 'ui';

import { formMinTimeBetweenUpdates } from './model';


export const TimeBetweenUpdatesRange = () => {
  return (
    <FlexRow gap={5}>
      <InputRange
        min={1}
        max={MAX_STEP_TIME_MS}
        {...formMinTimeBetweenUpdates.use()}
      />
    </FlexRow>
  );
};
