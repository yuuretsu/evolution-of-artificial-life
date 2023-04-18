import { GenomeVisualizer } from 'App/Sidebar/GenomeVisualizer';
import { useEffect, useState } from 'react';
import { MAX_ACTIONS } from 'settings';
import { FlexColumn, SubBlock } from 'ui';
import { Accordion, DropdownSmall, InputNumberSmall, WideButton } from 'ui';
import { fixNumber, limit } from 'lib/helpers';

import { Gene, NULL_GENE, NULL_GENE_TEMPLATE } from './gene';
import { GENES } from './genes';

import type { GenePool } from './types';
import type { Bot } from 'lib/bot';
import type { World } from 'lib/world';

export class Genome {
  recentlyUsedGenes: Gene[] = [];
  genes: Gene[];
  private _pointer: number = 0;

  constructor(length: number) {
    this.genes = new Array<Gene>(length)
      .fill(new Gene(NULL_GENE_TEMPLATE, { option: 0, branches: [0, 0] }));
  }

  get activeGene() {
    return this.recentlyUsedGenes.at(-1) || null;
  }
  get pointer() {
    return this._pointer;
  }
  set pointer(n: number) {
    this._pointer = fixNumber(0, this.genes.length, n);
  }
  fillRandom(pool: GenePool): this {
    this.genes = this.genes.map(() => Gene.random(pool, this.genes.length));
    return this;
  }
  replication(pool: GenePool) {
    const genome = new Genome(this.genes.length);
    genome.genes = this.genes.map(gene =>
      Math.random() > 0.995 ? gene.mutate(pool, this.genes.length) : gene || NULL_GENE
    );
    return genome;
  }
  doAction(bot: Bot, x: number, y: number, world: World) {
    this.recentlyUsedGenes = [];
    for (let i = 0; i < MAX_ACTIONS; i++) {
      const gene = this.genes[this.pointer];
      if (!gene) continue;
      const result = gene
        .template
        .action({ bot, x, y, world, property: gene.property });
      this.recentlyUsedGenes.push(gene);
      if ('colorInfluence' in gene.template) {
        bot.color = bot.color.lerp(gene.template.color, gene.template.colorInfluence);
      }
      this.pointer = typeof result.goto !== 'undefined'
        ? result.goto
        : this.pointer + 1;
      bot.lastActions.push(result.msg || gene.template.name);
      if (result.isCompleted) {
        return;
      }
    }
    bot.energy -= 1;
  }

  Render = () => {
    const [genes, setGenes] = useState(this.genes);
    const [selectedGene, setSelectedGene] = useState<{ id: number, gene: Gene } | null>(null);
    const [option, setOption] = useState<number | string>(0);
    const [branches, setBranches] = useState<Array<number | string>>([0, 0]);

    useEffect(() => {
      setGenes(this.genes);
      setSelectedGene(null);
    }, [this]);

    useEffect(() => {
      setOption(selectedGene?.gene.property.option.toFixed(2) || 0);
      setBranches(selectedGene?.gene.property.branches || [0, 0]);
    }, [selectedGene]);

    return (
      <FlexColumn gap={10}>
        <Accordion name="Ген" isSmall isDefaultOpened>
          {selectedGene ? (
            <>
              <FlexColumn gap={5}>
                <div>
                  <DropdownSmall
                    name={selectedGene.gene.template.name}
                    list={Object.keys(GENES).map(key => {
                      return { value: key, title: GENES[key]?.name || NULL_GENE_TEMPLATE.name };
                    })}
                    onChange={value => {
                      selectedGene.gene.template = GENES[value] || NULL_GENE_TEMPLATE;
                      this.genes = [...genes];
                      setGenes(this.genes);
                    }}
                  />
                  <InputNumberSmall
                    name={'Параметр'}
                    value={option.toString()}
                    onChange={e => {
                      setOption(e.target.value);
                    }}
                    onBlur={e => {
                      const value = e.target.value;
                      if (value.length > 0) {
                        selectedGene.gene.property.option = limit(
                          0,
                          1,
                          parseFloat(value)
                        );
                      }
                      setOption(selectedGene.gene.property.option);
                    }}
                  />
                  {branches && selectedGene
                    .gene
                    .property
                    .branches
                    .map((value, i) => {
                      return (
                        <InputNumberSmall
                          name={`Ветка ${i + 1}`}
                          key={i}
                          value={branches[i]}
                          onChange={e => {
                            const value = e.target.value;
                            const newBranches = [...branches];
                            newBranches[i] = value;
                            setBranches(newBranches);
                          }}
                          onBlur={e => {
                            const value = e.target.value;
                            if (value.length > 0) {
                              selectedGene.gene.property.branches[i] = fixNumber(
                                0,
                                this.genes.length,
                                parseInt(value)
                              );
                            }
                            setBranches(selectedGene.gene.property.branches);
                          }}
                        />
                      );
                    })}
                </div>
                <WideButton onClick={() => {
                  this.genes[selectedGene.id] = new Gene(selectedGene.gene.template, {
                    ...selectedGene.gene.property,
                    branches: [...selectedGene.gene.property.branches]
                  });

                  setSelectedGene({ ...selectedGene, gene: this.genes[selectedGene.id]! });
                }}
                >Сделать индивидуальным</WideButton>
              </FlexColumn>
            </>
          ) : (
            <span>Кликните по круглому гену на вкладке ниже, чтобы увидеть информацию о нём.</span>
          )}
        </Accordion>
        <Accordion name="Геном" isSmall isDefaultOpened>
          <FlexColumn gap={10}>
            <SubBlock>Позиция указателя: {this.pointer}</SubBlock>
            <GenomeVisualizer
              genome={this}
              selectedGene={selectedGene}
              setSelectedGene={setSelectedGene}
            />
          </FlexColumn>
        </Accordion>
      </FlexColumn>
    );
  };
}

export const getInitiallyEnabledGenesNames = () => Object
  .entries(GENES)
  .reduce<Record<string, boolean>>((acc, [name, template]) => ({
    ...acc,
    [name]: !template.isDefaultDisabled
  }), {});

export { enabledGenesToPool } from './genes';
export type { GenePool };
export { GENES, Gene };

