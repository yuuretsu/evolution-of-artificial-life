import { MAX_STEP_TIME_MS } from 'shared/settings';
import { connectForm } from 'shared/lib/helpers';
import { $minTimeBetweenUpdates } from 'entities/min-time-between-updates/model';

export const formMinTimeBetweenUpdates = connectForm(
  $minTimeBetweenUpdates,
  x => String(MAX_STEP_TIME_MS - x),
  x => MAX_STEP_TIME_MS - +x
);
