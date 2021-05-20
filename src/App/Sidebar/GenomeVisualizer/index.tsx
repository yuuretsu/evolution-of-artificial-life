import React from "react";
import styled from "styled-components";
import { Gene, Genome } from "../../../lib/genome";
import { GENE_CELL_SIZE as CELL_SIZE } from "../../../settings";
import { GeneCell } from "./GeneCell";

const GenomeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${8 * CELL_SIZE}px;
  border: 2px solid #505050;
  border-radius: ${CELL_SIZE / 2 + 3}px;
`;

export const GenomeVisualizer: React.FC<{
  genome: Genome;
  selectedGene: {id: number, gene: Gene} | null;
  setSelectedGene: (value: {id: number, gene: Gene} | null) => any;
}> = (props) => {
  const activeGene = props.genome.recentlyUsedGenes[props.genome.recentlyUsedGenes.length - 1];
  return (
    <GenomeWrapper>
      {props.genome.genes.map((gene, i) => {
        const state =
          activeGene === gene
            ? "active"
            : props.genome.recentlyUsedGenes.includes(gene)
              ? "activeLast"
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
