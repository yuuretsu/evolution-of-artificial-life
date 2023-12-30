import styled from 'styled-components';
import { SIDEBAR_WIDTH_PX } from 'settings';

import type { Gene } from './gene';

export type GenomeHistoryProps = {
  history: Gene[][],
};

export const GenomeHistory = ({ history }: GenomeHistoryProps) => {
  return (
    <GenesHistory>
      {
        history.slice(-AMOUNT).map((genes, i) => {
          return (
            <GenesHistoryColumn key={i}>
              {
                genes.map((gene, j) => {
                  return (
                    <GenesHistoryCell
                      key={j}
                      style={{ backgroundColor: gene.template.color?.toString() }}
                    />
                  );
                })
              }
            </GenesHistoryColumn>
          );
        })
      }
    </GenesHistory>
  );
};

const GenesHistory = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: rgb(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
`;


const AMOUNT = 32;
const SIZE = SIDEBAR_WIDTH_PX / AMOUNT;

const GenesHistoryColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: ${SIZE}px;
`;

const GenesHistoryCell = styled.div`
  width: ${SIZE}px;
  height: ${SIZE}px;
`;