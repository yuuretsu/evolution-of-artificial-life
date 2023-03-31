import Accordion from "App/Sidebar/Accordion";
import DropdownSmall from "App/Sidebar/DropdownSmall";
import InputNumberSmall from "App/Sidebar/InputNumberSmall";
import SubBlock from "App/Sidebar/SubBlock";
import WideButton from "App/Sidebar/WideButton";
import { GenomeVisualizer } from "App/Sidebar/GenomeVisualizer";
import { Bot } from "./bot";
import Rgba from "./color";
import { fixNumber, interpolate, limit, randChoice, randFloat, randInt } from "./helpers";
import { World } from "./world";
import { MAX_ACTIONS } from "settings";
import { useEffect, useState } from "react";

export type GenePool = GeneTemplate[];

export class Genome {
  private _pointer: number = 0;
  recentlyUsedGenes: Gene[] = [];
  activeGene: Gene | null = null;
  genes: Gene[];
  constructor(length: number) {
    this.genes = new Array<Gene>(length).fill({
      template: NULL_GENE_TEMPLATE,
      property: {
        option: 0,
        branches: [0, 0]
      }
    });
  }
  set pointer(n: number) {
    this._pointer = fixNumber(0, this.genes.length, n);
  }
  get pointer() {
    return this._pointer;
  }
  fillRandom(pool: GenePool): this {
    for (let i = 0; i < this.genes.length; i++) {
      this.genes[i] = randGene(pool, this.genes.length);
    }
    return this;
  }
  mutateGene(pool: GenePool, gene: Gene): Gene {
    const template = randChoice(pool) || NULL_GENE_TEMPLATE;

    const branches = gene.property.branches.map(i => {
      return Math.random() > 0.9 ? randInt(0, this.genes.length) : i;
    }) as [number, number];

    const option = limit(0, 1, gene.property.option + randFloat(-0.01, 0.01));

    return { template, property: { option, branches } };
  }
  replication(pool: GenePool) {
    const genome = new Genome(this.genes.length);
    genome.genes = this.genes.map(gene =>
      Math.random() > 0.995 ? this.mutateGene(pool, gene || NULL_GENE) : gene || NULL_GENE
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
        .action(bot, x, y, world, gene.property);
      this.recentlyUsedGenes.push(gene);
      this.activeGene = gene;
      bot.lastActions.push(result.msg || gene.template.name);
      if (gene.template.colorInfluence !== null && gene.template.color) {
        bot.color = bot.color.interpolate(gene.template.color, gene.template.colorInfluence);
      }
      this.pointer = result.goto !== null
        ? result.goto
        : this.pointer + 1;
      if (result.completed) return;
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
              this.genes[selectedGene.id] = {
                template: selectedGene.gene.template,
                property: {
                  ...selectedGene.gene.property,
                  branches: [...selectedGene.gene.property.branches]
                }
              }
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

export function enabledGenesToPool(genes: { [geneName: string]: boolean }): GenePool {
  return namesToGenePool(
    Object
      .keys(genes)
      .filter(key => genes[key])
  );
}

export function namesToGenePool(names: string[]): GenePool {
  const pool = [];
  for (const geneName of names) {
    const GENE = GENES[geneName];
    if (GENE) pool.push(GENE);
  }
  return pool;
}

export function randGeneProperty(genomeLength: number): GeneProperty {
  return {
    option: Math.random(),
    branches: [
      randInt(0, genomeLength),
      randInt(0, genomeLength),
    ]
  }
}

export function randGene(pool: GenePool, genomeLength: number): Gene {
  return {
    template: randChoice(pool) || NULL_GENE_TEMPLATE,
    property: randGeneProperty(genomeLength)
  }
}

export type ActionResult = { completed: boolean, goto: number | null, msg?: string };

export type GeneProperty = {
  option: number,
  branches: [number, number]
};

export type ActionFn = (
  bot: Bot,
  x: number,
  y: number,
  world: World,
  property: GeneProperty
) => ActionResult;

export type GeneTemplate = {
  name: string,
  description?: string,
  defaultEnabled: boolean,
  color: Rgba | null,
  colorInfluence: number | null,
  action: ActionFn
};

export type Gene = {
  template: GeneTemplate,
  property: GeneProperty
};

export const NULL_GENE_TEMPLATE: GeneTemplate = {
  name: 'Пустой ген',
  description: `Ничего не происходит`,
  defaultEnabled: false,
  color: new Rgba(127, 127, 127, 255),
  colorInfluence: 0.01,
  action: (_bot, _x, _y, _world, _property) => {
    return { completed: true, goto: null, msg: `Бездействие` };
  }
};

export const NULL_GENE: Gene = {
  template: NULL_GENE_TEMPLATE,
  property: {
    option: 0,
    branches: [0, 0],
  }
}

export const GENES: { [index: string]: GeneTemplate } = {
  doNothing: {
    name: 'Отдых',
    description: `Прибавляет 0,1 к здоровью`,
    defaultEnabled: true,
    color: new Rgba(100, 100, 0, 255),
    colorInfluence: 0.01,
    action: (bot, x, y, world, property) => {
      const value = 0.1;
      bot.health = Math.min(1, bot.health + 0.1);
      return { completed: true, goto: null, msg: `Лечение +${value}` };
    }
  },
  multiply: {
    name: 'Размножение',
    description: `Бот теряет 1/10 энергии на попытку размножения. Если клетка перед ним пуста, энергии больше 5 единиц, а возраст больше 10 кадров, бот размножается. Потомку передается количество энергии, равное параметру гена, такое же количество вычитается из собственной энергии.`,
    defaultEnabled: true,
    color: new Rgba(255, 255, 200, 255),
    colorInfluence: 0.01,
    action: (bot, x, y, world, property) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      bot.energy *= 0.9;
      if (F_BLOCK) return { completed: true, goto: null, msg: `Размножение не удалось: спереди блок` };
      if (bot.energy <= 5) return { completed: true, goto: null, msg: `Размножение не удалось: мало энергии` };
      if (bot.age <= 10) return { completed: true, goto: null, msg: `Размножение не удалось: бот слишком молод` };
      world.set(...F_COORDS, bot.multiply(world.genePool, property.option));
      return { completed: true, goto: null, msg: `Размножение` };
    }
  },
  rotate: {
    name: 'Поворот',
    description: `Бот поворачивается по часовой стрелке, если параметр гена > 0,5, иначе против часовой стрелки`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      bot.narrow = property.option > 0.5
        ? bot.narrow + 1
        : bot.narrow - 1
      return { completed: false, goto: null, msg: `Поворот ${property.option > 0.5 ? 'направо' : 'налево'}` };
    }
  },
  photosynthesis: {
    name: 'Фотосинтез',
    description: `Бот получает энергию путем фотосинтеза. При этом эффективность его фотосинтеза возрастает, а эффективность атак — падает. Восстанавливает своё здоровье на 0,01.`,
    defaultEnabled: true,
    color: new Rgba(0, 255, 0, 255),
    colorInfluence: 0.01,
    action: (bot, x, y, world, property) => {
      const energy = 1 * bot.abilities.photosynthesis ** 2;
      bot.energy += energy;
      bot.increaseAbility('photosynthesis');
      bot.health = Math.min(1, bot.health + 0.01);
      return { completed: true, goto: null, msg: `Фототсинтез: +${energy.toFixed(2)} энергии` };
    }
  },
  attack: {
    name: 'Атака',
    description: `Бот атакует блок перед собой, забирая себе часть его энергии.Повышает здоровье на 0,01.`,
    defaultEnabled: true,
    color: new Rgba(255, 0, 0, 255),
    colorInfluence: 0.01,
    action: (bot, x, y, world, property) => {
      const F_BLOCK = world.get(
        ...world.narrowToCoords(x, y, bot.narrow, 1)
      );
      let msg: string;
      if (F_BLOCK) {
        const value = interpolate(0, 5, property.option) * bot.abilities.attack ** 2;
        const result = F_BLOCK.onAttack(bot, value);
        bot.increaseAbility('attack');
        bot.health = Math.min(1, bot.health + 0.01);
        msg = `Атака: +${result.toFixed(2)} энергии`;
      } else {
        msg = `Атака не удалась`;
      }
      bot.energy -= 0.5;
      return { completed: true, goto: null, msg };
    }
  },
  virus: {
    name: 'Заразить геном',
    description: `Бот копирует с свой геном в бота напротив, при этом есть шанс мутации. Расходует 0,1 здоровья и 0,1 энергии.`,
    defaultEnabled: false,
    color: new Rgba(255, 50, 255, 255),
    colorInfluence: 0.05,
    action: (bot, x, y, world, property) => {
      const F_BLOCK = world.get(
        ...world.narrowToCoords(x, y, bot.narrow, 1)
      );
      let msg: string;
      if (F_BLOCK) {
        F_BLOCK.onVirus(bot, world.genePool);
        msg = `Заражение другого бота`;
      } else {
        msg = `Заражение не удалось`;
      }
      bot.health -= 0.1;
      bot.energy -= 0.1;
      return { completed: true, goto: null, msg };
    }
  },
  moveForward: {
    name: 'Двигаться вперед',
    description: `Бот перемещется в клетку перед собой, если она пустая. Расходует 0,5 энергии.`,
    defaultEnabled: true,
    color: new Rgba(200, 200, 200, 255),
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      let msg: string;
      if (!F_BLOCK) {
        world.swap(x, y, ...F_COORDS);
        msg = `Передвижение`;
      } else {
        msg = `Передвижение не удалось`;
      }
      bot.energy -= 0.5;
      return { completed: true, goto: null, msg };
    }
  },
  push: {
    name: 'Толкнуть',
    description: `Бот отталкивает блок перед собой на одну клетку, если клетка за ним пуста. Расходует 0,5 энергии.`,
    defaultEnabled: true,
    color: new Rgba(0, 0, 255, 255),
    colorInfluence: 0.01,
    action: (bot, x, y, world, property) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      const O_COORDS = world.narrowToCoords(x, y, bot.narrow, 2);
      const O_BLOCK = world.get(...O_COORDS);
      let msg: string;
      if (F_BLOCK && !O_BLOCK) {
        world.swap(...F_COORDS, ...O_COORDS);
        msg = `Толкнул другой объект`;
      } else {
        msg = `Не удалось толкнуть другой объект`;
      }
      bot.energy -= 0.5;
      return { completed: true, goto: null, msg };
    }
  },
  swap: {
    name: 'Меняться местами',
    description: `Бот меняется местами с клеткой перед собой, расходуя при этом 1 энергии.`,
    defaultEnabled: false,
    color: new Rgba(255, 255, 255, 255),
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      world.swap(...F_COORDS, x, y);
      bot.energy -= 1;
      return { completed: true, goto: null, msg: `Поменялся местами с другой клеткой` };
    }
  },
  movePointer: {
    name: 'Переместить указатель',
    description: `Следующая команда генома будет той, которая указана в ветке 1 текущего гена.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      const goto = property.branches[0];
      const msg = `Перенос указателя → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  checkHealth: {
    name: 'Проверить здоровье',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если здоровье бота меньше, чем параметр текущего гена.Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      if (bot.health < property.option) {
        const goto = property.branches[0];
        const msg = `Проверка здоровья → ${goto}`;
        return { completed: false, goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Проверка здоровья → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  checkEnergy: {
    name: 'Проверить энергию',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если энергия бота меньше, чем параметр текущего гена, умноженный на 300. Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      if (bot.energy / 300 < property.option) {
        const goto = property.branches[0];
        const msg = `Проверка энергии → ${goto}`;
        return { completed: false, goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Проверка энергии → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  forward: {
    name: 'Спереди блок?',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если перед ботом есть пустая клетка.Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      if (F_BLOCK) {
        const goto = property.branches[0];
        const msg = `Спереди блок → ${goto}`;
        return { completed: false, goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Спереди нет блока → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  compareFamilies: {
    name: 'Спереди родственник?',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если перед ботом находится родственник. Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: (bot, x, y, world, property) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      if (F_BLOCK) {
        const familyColor = F_BLOCK.getFamilyColor();
        if (
          familyColor !== null &&
          familyColor.difference(bot.familyColor) > property.option
        ) {
          const goto = property.branches[0];
          const msg = `Спереди родственник → ${goto}`;
          return { completed: false, goto, msg };
        }
      }
      const goto = property.branches[1];
      const msg = `Спереди нет родственника → ${goto}`;
      return { completed: false, goto, msg };
    }
  }
};