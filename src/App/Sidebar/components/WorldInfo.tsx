import { observer } from 'mobx-react';
import { Accordion, FlexColumn } from 'ui';
import { numberToShortString } from 'lib/helpers';

import type { FC } from 'react';

export interface IWorldInformationProps {
  cycle: number;
  botsAmount: number;
  stepTime: number;
}

export const WorldInformation: FC<IWorldInformationProps> = observer((props) => {
  return (
    <Accordion name='Инфо о мире' isOpen>
      <FlexColumn>
        <span>Возраст: {numberToShortString(props.cycle, 2)} кадров</span>
        <span>Ботов: {numberToShortString(props.botsAmount, 2)}</span>
        <span>Время обработки: {numberToShortString(props.stepTime, 2)} мс.</span>
      </FlexColumn>
    </Accordion>
  );
});
