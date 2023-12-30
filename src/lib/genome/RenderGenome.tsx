import { useForceRender } from 'lib/hooks';
import { limit, cycleNumber } from 'lib/helpers';
import { useState, useEffect } from 'react';
import { accordionsStates } from 'stores/accordions';
import { FlexColumn, Accordion, DropdownSmall, InputNumberSmall, WideButton, SubBlock, Table2Cols } from 'ui';

import { Gene, NULL_GENE_TEMPLATE } from './gene';
import { GENES } from './genes';
import { GenomeVisualizer } from './GenomeVisualizer';

import type { Genome } from '.';
import type { ChangeEventHandler, FC, FocusEventHandler, ReactNode } from 'react';
import type { GeneName } from './genes';

export const RenderGenome: FC<{ genome: Genome }> = ({ genome }) => {
  const rerender = useForceRender();
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

  const geneOptions = (Object.keys(GENES)).map(key => ({
    value: key,
    title: GENES[key]?.name || NULL_GENE_TEMPLATE.name
  }));

  const handleChangeGene = (value: GeneName) => {
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
        name="Ген"
        isSmall
        {...accordionsStates.getProps('gene', { onToggle: rerender })}
      >
        {selectedGene ? (
          <>
            <FlexColumn gap={5}>
              <FlexColumn gap={5}>
                <DropdownSmall<GeneName>
                  value={geneValue}
                  options={geneOptions}
                  onChange={handleChangeGene}
                />
                <Table2Cols
                  cells={[
                    [
                      'Параметр',
                      <InputNumberSmall
                        key={'option'}
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
                        return [
                          `Ветка ${i + 1}`,
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
      <Accordion
        name="Геном"
        isSmall
        {...accordionsStates.getProps('genome', { onToggle: rerender })}
      >
        <FlexColumn gap={10}>
          <SubBlock>Позиция указателя: {genome.pointer}</SubBlock>
          <GenomeVisualizer
            genome={genome}
            selectedGene={selectedGene}
            setSelectedGene={setSelectedGene}
          />
        </FlexColumn>
      </Accordion>
    </FlexColumn>
  );
};
