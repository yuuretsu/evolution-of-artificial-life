import { GENE_CELL_SIZE_PX, GENOME_VIEW_BORDER_PX } from 'shared/settings';
import styled from 'styled-components';

import { GenomeGridCell } from './genome-grid-cell';

import type { GeneCellState } from '../types';
import type { Gene, Genome } from 'shared/lib/genome';

const GenomeWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  border: ${GENOME_VIEW_BORDER_PX}px solid #505050;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: ${GENE_CELL_SIZE_PX / 2 + 3}px;
`;

export interface GenomeGridProps {
  genome: Genome;
  selectedGene: Gene | null;
  onClickGene: (index: number) => void;
}

export const GenomeGrid: React.FC<GenomeGridProps> = (props) => {
  const activeGene = props.genome.recentlyUsedGenes[props.genome.recentlyUsedGenes.length - 1];
  return (
    <GenomeWrapper>
      {props.genome.genes.map((gene, i) => {
        const state: GeneCellState =
          activeGene === gene
            ? 'active'
            : props.genome.recentlyUsedGenes.includes(gene)
              ? 'recentlyUsed'
              : 'notActive';
        return (
          <GenomeGridCell
            key={i}
            isSelected={props.selectedGene === gene}
            gene={gene}
            state={state}
            onClick={() => props.onClickGene(i)}
          />
        );
      })}
    </GenomeWrapper>
  );
};
