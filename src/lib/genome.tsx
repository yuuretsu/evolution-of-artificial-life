import React from "react";
import styled, { keyframes } from 'styled-components';
import Accordion from "../components/App/Sidebar/Accordion";
import Block from "../components/App/Sidebar/Block";
import OptionalBlock from "../components/App/Sidebar/OptionalBlock";
import SubBlock from "../components/App/Sidebar/SubBlock";
import { Bot } from "./bot";
import Rgba from "./color";
import { fixNumber, interpolate, limit, randChoice, randFloat, randInt } from "./helpers";
import { World } from "./world";

export type GenePool = GeneTemplate[];

const CELL_SIZE = 25;

const GenomeWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: ${8 * CELL_SIZE}px;
    /* height: ${8 * 21}px; */
    border: 2px solid #505050;
    border-radius: ${CELL_SIZE / 2}px;
    overflow: hidden;
`;

interface IGeneCell {
    readonly bg: string;
    readonly active?: boolean;
    readonly state: null | 'activeLast' | 'active';
};

const anim = keyframes`
    from {
        transform: translateY(-10px);
    }
    to {
        transform: scale(0.75);
    }
`;

const GeneCell = styled.div<IGeneCell>`
    box-sizing: border-box;
    width: ${CELL_SIZE}px;
    height: ${CELL_SIZE}px;
    background-color: ${props => props.bg};
    /* box-shadow:  ${props => props.active
        ? 'inset 0 0 0 2px white'
        : 'none'
    }; */
    border: ${props => props.state
        ? props.state === 'active'
            ? '3px solid white'
            : '3px dotted white'
        : 'none'
    };
    transform: scale(${props => props.state === 'active' ? 1 : 0.75});
    border-radius: 100%;
    transition: background-color 0.2s;
    animation: ${anim} 0.5s;
`;

const LiAction = styled.li`
`;

export class Genome {
    private _pointer: number = 0;
    private recentlyUsedGenes: Gene[] = [];
    activeGene: Gene | null = null;
    genes: Gene[];
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
        this.recentlyUsedGenes = [];
        for (let i = 0; i < 8; i++) {
            const gene = this.genes[this.pointer]!;
            const result = gene
                .template
                .action(bot, x, y, world, gene.property);
            this.recentlyUsedGenes.push(gene);
            if (gene.template.colorInfluence !== null && gene.template.color) {
                bot.color = bot.color.interpolate(gene.template.color, gene.template.colorInfluence);
            }
            this.pointer = result.goto !== null
                ? this.pointer = result.goto
                : this.pointer = this.pointer + 1;
            if (result.completed) {
                this.activeGene = this.recentlyUsedGenes.pop() || null;
                return;
            };
        }
        this.activeGene = this.recentlyUsedGenes.pop() || null;
        bot.energy -= 1;
    }
    getInfo() {
        return (
            <>
                <SubBlock name="Геном">
                    <GenomeWrapper>
                        {this.genes.map((gene, i) => {
                            const color = gene.template.color
                                ? gene
                                    .template
                                    .color
                                    .interpolate(new Rgba(0, 0, 0, 255), 0.25)
                                    .toString()
                                : 'rgba(127, 127, 127, 0.1)';
                            const state = this.activeGene === gene
                                ? 'active'
                                : this.recentlyUsedGenes.includes(gene)
                                    ? 'activeLast'
                                    : null;
                            return (
                                <GeneCell
                                    key={i}
                                    title={gene.template.name}
                                    bg={color}
                                    state={state}
                                >
                                </GeneCell>
                            );
                        })}
                    </GenomeWrapper>
                </SubBlock>
                <Accordion name="Последние действия" small defaultOpened>
                    <SubBlock>
                        <ul style={{ paddingLeft: '18px', margin: 0 }}>
                            {this.recentlyUsedGenes.map(gene => {
                                return <LiAction>{gene.template.name}</LiAction>
                            })}
                            {<LiAction>{this.activeGene?.template.name}</LiAction>}
                            {new Array(8 - this.recentlyUsedGenes.length - 1).fill(0).map(() => {
                                return <LiAction />
                            })}
                        </ul>
                    </SubBlock>
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
    defaultEnabled: boolean,
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
        name: 'Самолечение',
        defaultEnabled: true,
        color: new Rgba(127, 127, 0, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            bot.age += 1;
            bot.health = Math.min(1, bot.health + 0.1);
            return { completed: true, goto: null };
        }
    },
    multiply: {
        name: 'Размножение',
        defaultEnabled: true,
        color: new Rgba(255, 255, 200, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
            const F_BLOCK = world.get(...F_COORDS);
            bot.energy *= 0.99;
            if (!F_BLOCK && bot.energy > 5 && bot.age > 10) {
                world.set(...F_COORDS, bot.multiply(world.genePool));
            }
            return { completed: true, goto: null };
        }
    },
    rotate: {
        name: 'Поворот',
        defaultEnabled: true,
        color: null,
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            bot.narrow = property.option > 0.5
                ? bot.narrow + 1
                : bot.narrow - 1
            return { completed: false, goto: null };
        }
    },
    photosynthesis: {
        name: 'Фотосинтез',
        defaultEnabled: true,
        color: new Rgba(0, 255, 0, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            bot.energy += 1 * bot.abilities.photosynthesis ** 2;
            bot.increaseAbility('photosynthesis');
            bot.health = Math.min(1, bot.health + 0.01);
            return { completed: true, goto: null };
        }
    },
    attack: {
        name: 'Атака',
        defaultEnabled: true,
        color: new Rgba(255, 0, 0, 255),
        colorInfluence: 0.01,
        action: (bot, x, y, world, property) => {
            const F_BLOCK = world.get(
                ...world.narrowToCoords(x, y, bot.narrow, 1)
            );
            if (F_BLOCK) {
                F_BLOCK.getAttacked(bot, interpolate(0, 5, property.option));
                bot.health = Math.min(1, bot.health + 0.01);
            }
            bot.energy -= 0.05;
            return { completed: true, goto: null };
        }
    },
    moveForward: {
        name: 'Двигаться вперед',
        defaultEnabled: true,
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
    push: {
        name: 'Толкнуть',
        defaultEnabled: true,
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
        defaultEnabled: false,
        color: new Rgba(255, 255, 255, 255),
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
            world.swap(...F_COORDS, x, y);
            bot.energy -= 1;
            return { completed: true, goto: null };
        }
    },
    movePointer: {
        name: 'Переместить указатель',
        defaultEnabled: true,
        color: null,
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            return { completed: false, goto: property.branches[0] };
        }
    },
    checkHealth: {
        name: 'Проверить здоровье',
        defaultEnabled: true,
        color: null,
        colorInfluence: null,
        action: (bot, x, y, world, property) => {
            if (bot.health < property.option) {
                return { completed: false, goto: property.branches[0] };
            }
            return { completed: false, goto: property.branches[0] };
        }
    },
    forward: {
        name: 'Спереди блок?',
        defaultEnabled: true,
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