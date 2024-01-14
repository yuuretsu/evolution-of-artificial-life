import styled from 'styled-components';

import type { ReactNode } from 'react';

export type Table2ColsProps = {
  cells: [ReactNode, ReactNode][]
};

export const Table2Cols = ({ cells }: Table2ColsProps) => {
  return (
    <Table>
      <tbody>
        {cells.map(([left, right], i) => (
          <tr key={i}>
            <TdLeft>{left}</TdLeft>
            <TdRight>{right}</TdRight>
          </tr>
        ))}
      </tbody>
    </Table>
  );

};

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const Td = styled.td`
  line-height: 1.5;
  padding: 0;
`;

const TdLeft = styled(Td)`
  width: 130px;
`;

const TdRight = styled(Td)`
  padding-left: 10px;
`;