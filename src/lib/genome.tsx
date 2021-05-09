import React from "react";
import styled from 'styled-components';
import Block from "../components/App/Sidebar/Block";
import SubBlock from "../components/App/Sidebar/SubBlock";
import { Bot } from "./bot";
import Rgba from "./color";
import { fixNumber, interpolate, limit, randChoice, randFloat, randInt } from "./helpers";
import { World } from "./world";

export type GenePool = GeneTemplate[];

const GenomeWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: ${8 * 21}px;
    height: ${8 * 21}px;
    border: 2px solid whitesmoke;
    border-radius: 5px;
    overflow: hidden;
`;

interface IGeneCell {
    readonly bg: string;
    readonly border?: boolean;
};

const GeneCell = styled.div<IGeneCell>`
    width: 21px;
    height: 21px;
    background-color: ${props => props.bg};
    box-shadow:  ${props => props.border ? 'inset 0 0 0 2px white, inset 0 0 0 4px black' : 'none'};
    transition: background-color 0.2s;
`;

export class Genome {
    private _pointer: number = 0;
    genes: Gene[];
    lastAction: number = 0;
    constructor(length: number) {
        this.genes = new Array<Gene>(length).fill({
            template: GENES.doNothing!,
            property: {
                option: 0,
                branches: [0, 0, 0, 0]
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
        return {
            template: randChoice(pool),
            property: {
                option: limit(0, 1, gene.property.option + randFloat(-0.01, 0.01)),
                branches: gene.property.branches.map(
                    i => Math.random() > 0.9
                        ? randInt(0, this.genes.length)
                        : i
                ) as [number, number, number, number]
            }
        }
    }
    replication(pool: GenePool) {
        const genome = new Genome(this.genes.length);
        for (let i = 0; i < this.genes.length; i++) {
            genome.genes[i] = Math.random() > 0.995
                ? this.mutateGene(pool, this.genes[i]!)
                : this.genes[i]!;
        }
        return genome;
    }
    doAction(bot: Bot, x: number, y: number, world: World) {
        for (let i = 0; i < 20; i++) {
            const GENE = this.genes[this.pointer]!;
            const RESULT = GENE
                .template
                .action(bot, x, y, world, GENE.property);
            bot.lastAction = GENE.template;
            this.lastAction = this.pointer;
            if (GENE.template.colorInfluence !== null && GENE.template.color) {
                bot.color = bot.color.interpolate(GENE.template.color, GENE.template.colorInfluence);
            }
            this.pointer = RESULT.goto !== null
                ? this.pointer = RESULT.goto
                : this.pointer = this.pointer + 1;
            if (RESULT.completed) return;
        }
    }
    getInfo() {
        return (
            <SubBlock name="Геном">
                <GenomeWrapper>
                    {this.genes.map((gene, i) => {
                        const color = gene.template.color
                            ? gene.template.color.toString()
                            : 'transparent';
                        const border = this.lastAction === i;
                        return (
                            <GeneCell key={i} title={gene.template.name} bg={color} border={border}>
                            </GeneCell>
                        );
                    })}
                </GenomeWrapper>
            </SubBlock>
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
            randInt(0, genomeLength),
            randInt(0, genomeLength),
        ]
    }
}

export function randGene(pool: GenePool, genomeLength: number): Gene {
    return {
        template: randChoice(pool),
        property: randGeneProperty(genomeLength)
    }
}

export type ActionResult = { completed: boolean, goto: number | null };

export type GeneProperty = {
    option: number,
    branches: [number, number, number, number]
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
    color: Rgba | null,
    colorInfluence: number | null,
    action: ActionFn
};

export type Gene = {
    template: GeneTemplate,
    property: GeneProperty
};

export const GENES: { [index: string]: GeneTemplate } = {
    doNothing: {
        name: 'Бездействие',
        color: new Rgba(127, 127, 127, 127),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            bot.age += 1;
            return { completed: false, goto: null };
        }
    },
    rotate: {
        name: 'Поворот',
        color: null,
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            bot.narrow = property.option > 0.5
                ? bot.narrow + 1
                : bot.narrow - 1
            return { completed: false, goto: null };
        }
    },
    moveForward: {
        name: 'Двигаться вперед',
        color: new Rgba(200, 200, 200, 255),
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
            const F_BLOCK = world.get(...F_COORDS);
            if (!F_BLOCK) {
                world.swap(x, y, ...F_COORDS);
                bot.energy -= 1;
            }
            return { completed: true, goto: null };
        }
    },
    photosynthesis: {
        name: 'Фотосинтез',
        color: new Rgba(0, 255, 0, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            bot.energy += 1 * bot.abilities.photosynthesis ** 2;
            bot.increaseAbility('photosynthesis');
            return { completed: true, goto: null };
        }
    },
    attack: {
        name: 'Атака',
        color: new Rgba(255, 0, 0, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            const F_BLOCK = world.get(
                ...world.narrowToCoords(x, y, bot.narrow, 1)
            );
            if (F_BLOCK) {
                F_BLOCK.getAttacked(bot, interpolate(0, 5, property.option));
            }
            bot.energy -= 0.05;
            return { completed: true, goto: null };
        }
    },
    push: {
        name: 'Толкнуть',
        color: new Rgba(0, 0, 255, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
            const F_BLOCK = world.get(...F_COORDS);
            const O_COORDS = world.narrowToCoords(x, y, bot.narrow, 2);
            const O_BLOCK = world.get(...O_COORDS);
            if (F_BLOCK && !O_BLOCK) {
                world.swap(...F_COORDS, ...O_COORDS);
            }
            return { completed: true, goto: null };
        }
    },
    swap: {
        name: 'Меняться местами',
        color: new Rgba(255, 255, 255, 255),
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
            world.swap(...F_COORDS, x, y);
            bot.energy -= 1;
            return { completed: true, goto: null };
        }
    },
    multiply: {
        name: 'Размножение',
        color: new Rgba(255, 255, 200, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
            const F_BLOCK = world.get(...F_COORDS);
            bot.energy *= 0.99;
            if (!F_BLOCK && bot.energy > 5 && bot.age > 10) {
                world.set(...F_COORDS, bot.multiply(world.genePool));
            }
            return { completed: false, goto: null };
        }
    },
    movePointer: {
        name: 'Переместить указатель',
        color: null,
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            return { completed: false, goto: property.branches[0] };
        }
    },
    forward: {
        name: 'Спереди блок?',
        color: null,
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
            const F_BLOCK = world.get(...F_COORDS);
            if (F_BLOCK) {
                return { completed: false, goto: property.branches[0] };
            }
            return { completed: false, goto: property.branches[1] };
        }
    }
};