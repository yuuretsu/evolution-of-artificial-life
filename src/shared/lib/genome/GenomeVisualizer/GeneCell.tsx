import { GENE_CELL_SIZE_PX } from 'shared/settings';
import styled from 'styled-components';

import { getBackgroundColor, getBorderColor, getSize } from './helpers';

import type { GeneCellState } from './types';
import type { Gene } from 'shared/lib/genome';

const GeneCellWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${GENE_CELL_SIZE_PX}px;
  height: ${GENE_CELL_SIZE_PX}px;
`;

const transitionVariants: Set<GeneCellState> = new Set(['active', 'recentlyUsed']);

const GeneCellCircle = styled.div`
  display: flex;
  justify-content: 'center';
  align-items: 'center';
  box-sizing: 'border-box';
  border-radius: 100%;
  cursor: pointer;
  font-size: 8px;
`;

type GeneCellProps = {
  gene: Gene;
  state: GeneCellState;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  isSelected?: boolean;
};

export const GeneCell = (props: GeneCellProps) => {
  const backgroundColor = getBackgroundColor(props.state, props.gene.template.color);
  const border = getBorderColor(props.state);
  const size = getSize(props.state);
  const transition = transitionVariants.has(props.state)
    ? 'box-shadow 0.5s'
    : 'background-color 0.2s, transform 0.5s, min-width 0.2s, min-height 0.2s, box-shadow 0.5s';
  const boxShadow = props.isSelected ? '0 0 10px 0 white' : 'none';
  const zIndex = props.state === 'active' ? 1 : 0;
  return (
    <GeneCellWrapper>
      <GeneCellCircle
        style={{
          backgroundColor,
          border,
          transition,
          boxShadow,
          zIndex,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
        }}
        onClick={props.onClick}
      >
        <span>{props.children}</span>
      </GeneCellCircle>
    </GeneCellWrapper>
  );
};
