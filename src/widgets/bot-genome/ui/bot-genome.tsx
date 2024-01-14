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

  const [selectedGeneIndex, setSelectedGeneIndex] = useState<number | null>(null);
  const selectedGene = selectedGeneIndex ? genome.genes[selectedGeneIndex] || null : null;

  useEffect(() => {
    setSelectedGeneIndex(null);
  }, [genome]);

  useEffect(() => {
    geneAccordionState.open();
  }, [selectedGene]);

  const handleClickMakeGeneIndividual = () => {
    if (!selectedGene || !selectedGeneIndex) return;
    genome.genes[selectedGeneIndex] = new Gene(selectedGene.template, {
      ...selectedGene.property,
      branches: [...selectedGene.property.branches]
    });

    rerender();
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
            onClickGene={setSelectedGeneIndex}
          />
          <Accordion
            name="Ген"
            isSmall
            {...geneAccordionProps}
          >
            {selectedGene ? (
              <FlexColumn gap={5}>
                <EditGene gene={selectedGene} genomeLength={genome.genes.length} onChange={rerender} />
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
