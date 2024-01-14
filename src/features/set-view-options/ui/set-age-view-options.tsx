import { InputRange, SubBlock } from 'shared/ui';
import { MAX_BOT_AGE } from 'shared/settings';

import { formAgeDivider } from '../model';

import type { FC } from 'react';


export const SetAgeViewOptions: FC = () => {
  return (
    <SubBlock name="Делитель возраста">
      <InputRange
        min={10}
        max={MAX_BOT_AGE}
        {...formAgeDivider.use()}
      />
    </SubBlock>
  );
};
