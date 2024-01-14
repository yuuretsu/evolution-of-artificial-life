import { InputRange, SubBlock } from 'shared/ui';
import { MAX_BOT_ENERGY } from 'shared/settings';

import { formEnergyDivider } from '../model';

import type { FC } from 'react';


export const SetEnergyViewOptions: FC = () => {
  return (
    <SubBlock name="Делитель энергии">
      <InputRange
        min={1}
        max={MAX_BOT_ENERGY}
        {...formEnergyDivider.use()}
      />
    </SubBlock>
  );
};
