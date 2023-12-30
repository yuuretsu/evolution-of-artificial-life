import { observer } from 'mobx-react';
import { Accordion, Table2Cols } from 'ui';
import { numberToShortString } from 'lib/helpers';
import { accordionsStates } from 'stores/accordions';
import { type FC } from 'react';

export interface IWorldInformationProps {
  cycle: number;
  botsAmount: number;
  stepTime: number;
  averageAge: number;
  maxGeneration: number;
}

export const WorldInformation: FC<IWorldInformationProps> = observer(({
  cycle,
  botsAmount,
  maxGeneration,
  averageAge,
  stepTime
}) => {
  return (
    <Accordion name='Инфо о мире' {...accordionsStates.getProps('worldInfo')}>
      <Table2Cols
        cells={[
          ['Возраст (кадров)', numberToShortString(cycle, 2)],
          ['Ботов', numberToShortString(botsAmount, 2)],
          ['Поколение', maxGeneration + 1],
          ['Ср. возраст ботов', numberToShortString(averageAge, 2)],
          ['Время обработки', numberToShortString(stepTime, 2) + ' мс.'],
        ]}
      />
    </Accordion>
  );
});
