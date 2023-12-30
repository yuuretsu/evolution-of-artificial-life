import styled from 'styled-components';

import type { ReactNode } from 'react';

export type Table2ColsProps = {
  cells: [ReactNode, ReactNode][]
};

export const Table2Cols = ({ cells }: Table2ColsProps) => {
  return (
    <Table>
      <tbody>
        {
          cells.map(([left, right], i) => (
            <tr key={i}>
              <Td>{left}</Td>
              <Td>{right}</Td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );

};

const gap = '10px';

const Table = styled.table`
  width: calc(100% + ${gap} * 2);
  border-spacing: ${gap} 0;
  margin-left: -${gap};
  margin-right: -${gap};
`;

const Td = styled.td`
  white-space: nowrap;

  &:nth-child(2) {
    width: 100%;
  }
`;
