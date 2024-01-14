import { useAccordionToggle } from 'lib/hooks';
import { limit, cycleNumber, createToggleStore } from 'lib/helpers';
import { useState, useEffect } from 'react';
import { FlexColumn, Accordion, DropdownSmall, InputNumberSmall, WideButton, SubBlock, Table2Cols, FlexRow, OptionalBlock } from 'ui';
import styled from 'styled-components';
import { hideScrollbar } from 'app/app.css';

import { Gene, NULL_GENE_TEMPLATE } from './gene';
import { GENES } from './genes';
import { GenomeVisualizer } from './GenomeVisualizer';
import { GenomeHistory } from './GenomeHistory';

import type { Genome } from '.';
import type { ChangeEventHandler, FC, FocusEventHandler, ReactNode } from 'react';
import type { GeneName } from './genes';

export const RenderGenome: FC<{ genome: Genome }> = ({ genome }) => {
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

  const [genes, setGenes] = useState(genome.genes);
  const [selectedGene, setSelectedGene] = useState<{ id: number, gene: Gene } | null>(null);
  const [option, setOption] = useState<number | string>(0);
  const [branches, setBranches] = useState<Array<number | string>>([0, 0]);

  useEffect(() => {
    setGenes(genome.genes);
    setSelectedGene(null);
  }, [genome]);

  useEffect(() => {
    setOption(selectedGene?.gene.property.option.toFixed(2) || 0);
    setBranches(selectedGene?.gene.property.branches || [0, 0]);
    geneAccordionState.open();
  }, [selectedGene]);

  const handleBlurParameter: FocusEventHandler<HTMLInputElement> = (e) => {
    if (!selectedGene) return;
    const value = e.target.value;
    if (value.length > 0) {
      selectedGene.gene.property.option = limit(
        0,
        1,
        parseFloat(value)
      );
    }
    setOption(selectedGene.gene.property.option);
  };

  const getBranchChangeHandler = (i: number): ChangeEventHandler<HTMLInputElement> => (e) => {
    const value = e.target.value;
    const newBranches = [...branches];
    newBranches[i] = value;
    setBranches(newBranches);
  };

  const getBranchBlurHandler = (i: number): FocusEventHandler<HTMLInputElement> => (e) => {
    if (!selectedGene) return;
    const value = e.target.value;
    if (value.length > 0) {
      selectedGene.gene.property.branches[i] = cycleNumber(
        0,
        genome.genes.length,
        parseInt(value)
      );
    }
    setBranches(selectedGene.gene.property.branches);
  };

  const geneValue = Object
    .entries(GENES)
    .find(([, value]) => value.name === selectedGene?.gene.template.name)
    ?.[0] as GeneName;

  const geneOptions = (Object.keys(GENES)).map(key => {
    const gene = GENES[key]!;
    const color = 'color' in gene ? gene.color : undefined;
    return {
      value: key,
      title: (
        <FlexRow gap={5} alignItems='center'>
          <SelectOptionGeneIcon color={color?.toString() || 'rgb(127, 127, 127, 0.1)'} />
          {GENES[key]?.name || NULL_GENE_TEMPLATE.name}
        </FlexRow>
      )
    };
  });

  const handleChangeGene = (value: string) => {
    if (!selectedGene) return;
    selectedGene.gene.template = GENES[value] || NULL_GENE_TEMPLATE;
    genome.genes = [...genes];
    setGenes(genome.genes);
  };

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
          <GenomeVisualizer
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
              <>
                <FlexColumn gap={5}>
                  <FlexColumn gap={5}>
                    <DropdownSmall
                      value={geneValue}
                      options={geneOptions}
                      onChange={handleChangeGene}
                    />
                    {selectedGene.gene.template.description && (
                      <OptionalBlock>
                        {selectedGene.gene.template.description}
                      </OptionalBlock>
                    )}
                    <Table2Cols
                      cells={[
                        [
                          <LabelName isNamed={!!selectedGene.gene.template.translation?.option} key={0}>
                            {selectedGene.gene.template.translation?.option || 'Параметр'}
                          </LabelName>,
                          <InputNumberSmall
                            key={1}
                            value={option.toString()}
                            onChange={e => setOption(e.target.value)}
                            onBlur={handleBlurParameter}
                          />
                        ],
                        ...selectedGene
                          .gene
                          .property
                          .branches
                          .map((_, i): [ReactNode, ReactNode] => {
                            const name = selectedGene.gene.template.translation?.branches?.[i];
                            return [
                              <LabelName isNamed={!!name} key={0}>
                                {name || `${i + 1} ветка`}
                              </LabelName>,
                              <InputNumberSmall
                                key={i}
                                value={branches[i]}
                                onChange={getBranchChangeHandler(i)}
                                onBlur={getBranchBlurHandler(i)}
                              />
                            ];
                          })
                      ]}
                    />
                  </FlexColumn>
                  <WideButton onClick={handleClickMakeGeneIndividual}>
                    Сделать индивидуальным
                  </WideButton>
                </FlexColumn>
              </>
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
            <LastActionsWrapper>
              {genome.lastActions.map(({ template, result }, i) => {
                return (
                  <div key={i} style={{ fontSize: '80%' }}>
                    - {result.msg || template.name}
                  </div>
                );
              })}
            </LastActionsWrapper>
          </Accordion>
        </FlexColumn>
      </Accordion>
    </FlexColumn>
  );
};

const genomeAccordionState = createToggleStore(true);
const geneAccordionState = createToggleStore(false);
const lastActionsAccordionState = createToggleStore(true);

const LabelName = styled.span<{ isNamed: boolean }>`
  opacity: ${props => props.isNamed ? 1 : 0.5};
`;

const SelectOptionGeneIcon = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  background-color: ${props => props.color};
`;

const LastActionsWrapper = styled.div`
  aspect-ratio: 2;
  padding: 5px;
  border-radius: 5px;
  background-color: #333;
  overflow-y: auto;
  ${hideScrollbar}
`;