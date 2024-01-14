import { observer } from 'mobx-react';
import { Accordion, Table2Cols } from 'ui';
import { createToggleStore, numberToShortString } from 'lib/helpers';
import { type FC } from 'react';
import { useAccordionToggle } from 'lib/hooks';

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
  const worldInfoAccordionProps = useAccordionToggle(
    worldInfoAccordionState.$isEnabled,
    worldInfoAccordionState.toggle
  );

  return (
    <Accordion name='Инфо о мире' {...worldInfoAccordionProps}>
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

const worldInfoAccordionState = createToggleStore(false);