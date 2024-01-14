import { FlexColumn, OptionalBlock } from 'shared/ui';
import { useUnit } from 'effector-react';


import { $viewMode } from '../model';

import { SetViewMode } from './set-view-mode';
import { SetAgeViewOptions } from './set-age-view-options';
import { SetEnergyViewOptions } from './set-energy-view-options';
import { SetVisibleActions } from './set-visible-actions';

import type { FC } from 'react';

export const SetViewOptions: FC = () => {
  const u = useUnit({
    viewModeName: $viewMode
  });

  return (
    <FlexColumn gap={10}>
      <SetViewMode />
      {u.viewModeName === 'age' && (
        <OptionalBlock>
          <SetAgeViewOptions />
        </OptionalBlock>
      )}
      {u.viewModeName === 'energy' && (
        <OptionalBlock>
          <SetEnergyViewOptions />
        </OptionalBlock>
      )}
      {u.viewModeName === 'lastAction' && (
        <OptionalBlock>
          <SetVisibleActions />
        </OptionalBlock>
      )}
    </FlexColumn>
  );
};
