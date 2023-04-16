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
    <Accordion name='Инфо о мире' isDefaultOpened>
      <FlexColumn>
        <span>Возраст: {numberToShortString(props.cycle, 2)} кадров</span>
        <span>Ботов: {props.botsAmount}</span>
        <span>Время обработки: {props.stepTime.toFixed(1)} мс.</span>
      </FlexColumn>
    </Accordion>
  );
});
