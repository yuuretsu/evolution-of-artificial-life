import { Rgba } from 'shared/lib/color';
import { limit, randChoice, randFloat, randInt } from 'shared/lib/helpers';

import type { GenePool, GeneProperty, GeneTemplate } from './types';

export class Gene {
  constructor(public template: GeneTemplate, public property: GeneProperty) { }

  static random(pool: GenePool, genomeLength: number) {
    return new Gene(
      randChoice(pool) || NULL_GENE_TEMPLATE,
      randGeneProperty(genomeLength),
    );
  }

  mutate(pool: GenePool, genomeLength: number): Gene {
    const template = randChoice(pool) || NULL_GENE_TEMPLATE;

    const branches = this.property.branches.map(i => {
      return Math.random() > 0.9 ? randInt(0, genomeLength) : i;
    }) as [number, number];

    const option = limit(0, 1, this.property.option + randFloat(-0.01, 0.01));

    return new Gene(template, { option, branches });
  }
}

function randGeneProperty(genomeLength: number): GeneProperty {
  return {
    option: Math.random(),
    branches: [
      randInt(0, genomeLength),
      randInt(0, genomeLength),
    ]
  };
}

export const NULL_GENE_TEMPLATE: GeneTemplate = {
  id: 'null',
  name: 'Пустой ген',
  description: 'Ничего не происходит',
  isDefaultDisabled: true,
  color: new Rgba(127, 127, 127),
  colorInfluence: 0.01,
  action: () => {
    return { isCompleted: true, msg: 'Бездействие' };
  }
};

export const NULL_GENE: Gene = new Gene(
  NULL_GENE_TEMPLATE,
  {
    option: 0,
    branches: [0, 0],
  }
);