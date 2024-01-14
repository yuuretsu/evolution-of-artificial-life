import { useUnit } from 'effector-react';
import { useThrottle } from 'shared/lib/hooks';
import { Table2Cols } from 'shared/ui';
import { numberToShortString } from 'shared/lib/helpers';

import { $worldInfo } from '../model';

import type { FC } from 'react';


export const WorldInfo: FC = () => {
  const u = useUnit({
    worldInfo: $worldInfo
  });

  const { cycle, botsAmount, maxGeneration, averageAge, stepTime } = useThrottle({
    cycle: u.worldInfo.cycle,
    botsAmount: u.worldInfo.dynamicBlocks,
    averageAge: u.worldInfo.averageAge,
    stepTime: u.worldInfo.stepTime,
    maxGeneration: u.worldInfo.maxGeneration,
  }, 100);

  return (
    <Table2Cols
      cells={[
        ['Возраст (кадров)', numberToShortString(cycle, 2)],
        ['Ботов', numberToShortString(botsAmount, 2)],
        ['Поколение', maxGeneration + 1],
        ['Ср. возраст ботов', numberToShortString(averageAge, 2)],
        ['Время обработки', numberToShortString(stepTime, 2) + ' мс.'],
      ]}
    />
  );
};
