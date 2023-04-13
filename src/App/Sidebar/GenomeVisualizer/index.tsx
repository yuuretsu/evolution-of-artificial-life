import styled from 'styled-components';
import { Gene, Genome } from 'lib/genome';
import { GeneCell } from './GeneCell';
import { GENE_CELL_SIZE_PX } from 'settings';

const GenomeWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  border: 2px solid #505050;
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
        const state =
          activeGene === gene
            ? 'active'
            : props.genome.recentlyUsedGenes.includes(gene)
              ? 'activeLast'
              : null;
        return (
          <GeneCell
            key={i}
            selected={props.selectedGene?.id === i}
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
