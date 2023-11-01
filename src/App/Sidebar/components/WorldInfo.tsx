import { observer } from 'mobx-react';
import { Accordion } from 'ui';
import { numberToShortString } from 'lib/helpers';
import { accordionsStates } from 'stores/accordions';
import styled from 'styled-components';
import { type FC } from 'react';
import { useThrottle } from 'hooks';

export interface IWorldInformationProps {
  cycle: number;
  botsAmount: number;
  stepTime: number;
  averageAge: number;
  maxGeneration: number;
}

export const WorldInformation: FC<IWorldInformationProps> = observer((props) => {

  const { cycle, botsAmount, averageAge, stepTime, maxGeneration } = useThrottle(props, 100);

  return (
    <Accordion name='Инфо о мире' {...accordionsStates.getProps('worldInfo')}>
      <Table>
        <tbody>
          <tr>
            <Td>Возраст (кадров):</Td>
            <Td>{numberToShortString(cycle, 2)}</Td>
          </tr>
          <tr>
            <Td>Ботов:</Td>
            <Td>{numberToShortString(botsAmount, 2)}</Td>
          </tr>
          <tr>
            <Td>Поколение:</Td>
            <Td>{maxGeneration + 1}</Td>
          </tr>
          <tr>
            <Td>Ср. возраст ботов:</Td>
            <Td>{numberToShortString(averageAge, 2)}</Td>
          </tr>
          <tr>
            <Td>Время обработки:</Td>
            <Td>{numberToShortString(stepTime, 2)} мс.</Td>
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
