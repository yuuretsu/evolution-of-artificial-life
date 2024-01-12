import { cycleNumber } from 'lib/helpers';
import { MAX_ACTIONS } from 'settings';
import { bindProps } from 'hoc';

import { Gene, NULL_GENE, NULL_GENE_TEMPLATE } from './gene';
import { GENES } from './genes';
import { RenderGenome } from './RenderGenome';

import type { Bot } from 'lib/bot';
import type { World } from 'lib/world';
import type { GeneName } from './genes';
import type { GenePool } from './types';

export class Genome {
  genesHistory: Gene[][] = [];
  genes: Gene[];
  private _lastActions: string[] = [];
  private _pointer: number = 0;

  constructor(length: number) {
    this.genes = new Array<Gene>(length)
      .fill(new Gene(NULL_GENE_TEMPLATE, { option: 0, branches: [0, 0] }));
  }

  get recentlyUsedGenes() {
    return this.genesHistory.at(-1) || [];
  }
  get activeGene() {
    return this.recentlyUsedGenes.at(-1) || null;
  }
  get pointer() {
    return this._pointer;
  }
  set pointer(n: number) {
    this._pointer = cycleNumber(0, this.genes.length, n);
  }
  get lastActions() {
    return this._lastActions;
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
    const recentlyUsedGenes = [];
    this._lastActions = [];
    for (let i = 0; i < MAX_ACTIONS; i++) {
      const gene = this.genes[this.pointer];
      if (!gene) continue;
      const result = gene
        .template
        .action({ bot, x, y, world, property: gene.property });
      recentlyUsedGenes.push(gene);
      if ('colorInfluence' in gene.template) {
        bot.color = bot.color.lerp(gene.template.color, gene.template.colorInfluence);
      }
      this.pointer = typeof result.goto !== 'undefined'
        ? result.goto
        : this.pointer + 1;
      this._lastActions.push(result.msg || gene.template.name);
      if (result.isCompleted) {
        this.genesHistory.push([...recentlyUsedGenes]);
        return;
      }
    }
    bot.energy -= 1;
    this.genesHistory.push([...recentlyUsedGenes]);
  }

  Render = bindProps(RenderGenome, { genome: this });
}

export const getInitiallyEnabledGenesNames = () => Object
  .entries(GENES)
  .reduce<Record<string, boolean>>((acc, [name, template]) => ({
    ...acc,
    [name]: 'isDefaultDisabled' in template ? !template.isDefaultDisabled : true,
  }), {});

export { enabledGenesToPool } from './genes';
export { GENES, Gene };
export type { GeneName, GenePool };

