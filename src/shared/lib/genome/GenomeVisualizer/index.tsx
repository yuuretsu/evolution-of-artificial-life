import { GENE_CELL_SIZE_PX, GENOME_VIEW_BORDER_PX } from 'shared/settings';
import styled from 'styled-components';

import { GeneCell } from './GeneCell';

import type { GeneCellState } from './types';
import type { Gene, Genome } from 'shared/lib/genome';

const GenomeWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  border: ${GENOME_VIEW_BORDER_PX}px solid #505050;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: ${GENE_CELL_SIZE_PX / 2 + 3}px;
`;

export interface IGenomeVisualizerProps {
  genome: Genome;
  selectedGene: { id: number, gene: Gene } | null;
  setSelectedGene: (value: { id: number, gene: Gene } | null) => void;
}

export const GenomeVisualizer: React.FC<IGenomeVisualizerProps> = (props) => {
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
          <GeneCell
            key={i}
            isSelected={props.selectedGene?.id === i}
            gene={gene}
            state={state}
            onClick={() =>
              props.setSelectedGene(
                props.selectedGene?.id === i
                  ? null
                  : { id: i, gene }
              )
            }
          />
        );
      })}
    </GenomeWrapper>
  );
};
