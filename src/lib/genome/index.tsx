import Accordion from "App/Sidebar/Accordion";
import DropdownSmall from "App/Sidebar/DropdownSmall";
import InputNumberSmall from "App/Sidebar/InputNumberSmall";
import SubBlock from "App/Sidebar/SubBlock";
import WideButton from "App/Sidebar/WideButton";
import { GenomeVisualizer } from "App/Sidebar/GenomeVisualizer";
import { Bot } from "lib/bot";
import { fixNumber, limit } from "../helpers";
import { World } from "lib/world";
import { MAX_ACTIONS } from "settings";
import { useEffect, useState } from "react";
import { GenePool } from "./types";
import { Gene, NULL_GENE, NULL_GENE_TEMPLATE } from "./gene";
import { GENES } from "./genes";

export class Genome {
  private _pointer: number = 0;
  recentlyUsedGenes: Gene[] = [];
  genes: Gene[];
  constructor(length: number) {
    this.genes = new Array<Gene>(length)
      .fill(new Gene(NULL_GENE_TEMPLATE, { option: 0, branches: [0, 0] }));
  }
  get activeGene() {
    return this.recentlyUsedGenes.at(-1) || null;
  }
  set pointer(n: number) {
    this._pointer = fixNumber(0, this.genes.length, n);
  }
  get pointer() {
    return this._pointer;
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
      if (gene.template.colorInfluence !== null && gene.template.color) {
        bot.color = bot.color.interpolate(gene.template.color, gene.template.colorInfluence);
      }
      this.pointer = result.goto !== null
        ? result.goto
        : this.pointer + 1;
      if (result.completed) {
        bot.lastActions.push(result.msg || gene.template.name);
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

    const activeGene = this.recentlyUsedGenes[this.recentlyUsedGenes.length - 1];

    useEffect(() => {
      setGenes(this.genes);
      setSelectedGene(null);
    }, [this]);

    useEffect(() => {
      setOption(selectedGene?.gene.property.option.toFixed(2) || 0);
      setBranches(selectedGene?.gene.property.branches || [0, 0]);
    }, [selectedGene]);

    return (
      <>
        <Accordion name="Ген" small defaultOpened>
          {selectedGene ? <>
            <SubBlock>
              <DropdownSmall
                name={selectedGene.gene.template.name}
                list={Object.keys(GENES).map(key => {
                  return { value: key, title: GENES[key]?.name || NULL_GENE_TEMPLATE.name }
                })}
                onChange={value => {
                  selectedGene.gene.template = GENES[value] || NULL_GENE_TEMPLATE;
                  this.genes = [...genes];
                  setGenes(this.genes);
                }}
              />
              <InputNumberSmall
                name={`Параметр`}
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
            </SubBlock>
            <WideButton onClick={() => {
              this.genes[selectedGene.id] = new Gene(selectedGene.gene.template, {
                ...selectedGene.gene.property,
                branches: [...selectedGene.gene.property.branches]
              });

              setSelectedGene({ ...selectedGene, gene: this.genes[selectedGene.id]! });
            }}>Сделать индивидуальным</WideButton>
          </> : <span>Кликните по круглому гену на вкладке ниже, чтобы увидеть информацию о нём.</span>}
        </Accordion>
        <Accordion name="Геном" small defaultOpened>
          <SubBlock>Позиция указателя: {this.pointer}</SubBlock>
          <GenomeVisualizer
            genome={this}
            selectedGene={selectedGene}
            setSelectedGene={setSelectedGene}
          />
        </Accordion>
      </>
    );
  }
}

export type { GenePool };
export { GENES };
export { enabledGenesToPool } from "./genes";
