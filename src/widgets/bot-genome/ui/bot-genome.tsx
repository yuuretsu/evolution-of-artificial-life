import { useAccordionToggle, useForceRender } from 'shared/lib/hooks';
import { createToggleStore } from 'shared/lib/helpers';
import { useState, useEffect } from 'react';
import { FlexColumn, Accordion, WideButton, SubBlock } from 'shared/ui';
import { type Genome } from 'shared/lib/genome';
import { Gene } from 'shared/lib/genome/gene';

import { GenomeGrid } from './genome-grid';
import { GenomeHistory } from './genome-history';
import { EditGene } from './edit-gene';
import { CurrentActions } from './current-actions';

import type { FC } from 'react';

export const BotGenome: FC<{ genome: Genome }> = ({ genome }) => {
  const rerender = useForceRender();
  const genomeAccordionProps = useAccordionToggle(
    genomeAccordionState.$isEnabled,
    genomeAccordionState.toggle
  );

  const geneAccordionProps = useAccordionToggle(
    geneAccordionState.$isEnabled,
    geneAccordionState.toggle
  );

  const lastActionsAccordionProps = useAccordionToggle(
    lastActionsAccordionState.$isEnabled,
    lastActionsAccordionState.toggle
  );

  const [selectedGene, setSelectedGene] = useState<{ id: number, gene: Gene } | null>(null);

  useEffect(() => {
    setSelectedGene(null);
  }, [genome]);

  useEffect(() => {
    geneAccordionState.open();
  }, [selectedGene]);

  const handleClickMakeGeneIndividual = () => {
    if (!selectedGene) return;
    genome.genes[selectedGene.id] = new Gene(selectedGene.gene.template, {
      ...selectedGene.gene.property,
      branches: [...selectedGene.gene.property.branches]
    });

    setSelectedGene({ ...selectedGene, gene: genome.genes[selectedGene.id]! });
  };

  return (
    <FlexColumn gap={10}>
      <Accordion
        name="Геном"
        isSmall
        {...genomeAccordionProps}
      >
        <FlexColumn gap={10}>
          <SubBlock>Позиция указателя: {genome.pointer}</SubBlock>
          <GenomeGrid
            genome={genome}
            selectedGene={selectedGene}
            setSelectedGene={setSelectedGene}
          />
          <Accordion
            name="Ген"
            isSmall
            {...geneAccordionProps}
          >
            {selectedGene ? (
              <FlexColumn gap={5}>
                <EditGene gene={selectedGene.gene} genomeLength={genome.genes.length} onChange={rerender} />
                <WideButton onClick={handleClickMakeGeneIndividual}>
                  Сделать индивидуальным
                </WideButton>
              </FlexColumn>
            ) : (
              <span>Кликните по круглому гену на вкладке ниже, чтобы увидеть информацию о нём.</span>
            )}
          </Accordion>
          <GenomeHistory history={genome.genesHistory} />
          <Accordion
            name='Последние действия'
            isSmall
            {...lastActionsAccordionProps}
          >
            <CurrentActions actions={genome.lastActions} />
          </Accordion>
        </FlexColumn>
      </Accordion>
    </FlexColumn>
  );
};

const genomeAccordionState = createToggleStore(true);
const geneAccordionState = createToggleStore(false);
const lastActionsAccordionState = createToggleStore(true);
