import { observer } from 'mobx-react';
import { Accordion } from 'ui';
import { numberToShortString } from 'lib/helpers';
import { accordionsStates } from 'stores/accordions';
import styled from 'styled-components';
import { useThrottle } from '@uidotdev/usehooks';

import type { FC } from 'react';

export interface IWorldInformationProps {
  cycle: number;
  botsAmount: number;
  stepTime: number;
  averageAge: number;
}

export const WorldInformation: FC<IWorldInformationProps> = observer((props) => {
  const throttledInfo = useThrottle({ ...props }, 100);
  return (
    <Accordion name='Инфо о мире' {...accordionsStates.getProps('worldInfo')}>
      <Table>
        <tbody>
          <tr>
            <Td>Возраст (кадров):</Td>
            <Td>{numberToShortString(throttledInfo.cycle, 2)}</Td>
          </tr>
          <tr>
            <Td>Ботов:</Td>
            <Td>{numberToShortString(throttledInfo.botsAmount, 2)}</Td>
          </tr>
          <tr>
            <Td>Ср. возраст ботов:</Td>
            <Td>{numberToShortString(throttledInfo.averageAge, 2)}</Td>
          </tr>
          <tr>
            <Td>Время обработки:</Td>
            <Td>{numberToShortString(throttledInfo.stepTime, 2)} мс.</Td>
          </tr>
        </tbody>
      </Table>
    </Accordion>
  );
});

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
`;

const Td = styled.td`
  white-space: nowrap;

  &:not(:first-child) {
    padding-left: 10px;
  }
`;
