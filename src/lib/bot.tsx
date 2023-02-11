import { World } from "./world";
import Rgba from "./color";
import { fixNumber, limit, randInt } from "./helpers";
import { DynamicBlock } from "./block";
import { GenePool, Genome } from "./genome";
import { VisualiserParams } from "./view-modes";
import React, { useEffect, useState } from "react";
import SubBlock from "App/Sidebar/SubBlock";
import Accordion from "App/Sidebar/Accordion";
import InputNumberSmall from "App/Sidebar/InputNumberSmall";
import styled from "styled-components";

export type BotAbilityName = keyof typeof Bot.prototype.abilities;

export class Bot extends DynamicBlock {
    alive = true;
    private _narrow: number = randInt(0, 8);
    lastActions: string[] = [];
    age = 0;
    health = 0.5;
    childrenAmount = 0;
    constructor(
        public generation: number,
        color: Rgba,
        public familyColor: Rgba,
        public energy: number,
        public abilities: {
            photosynthesis: number,
            attack: number
        },
        public genome: Genome
    ) {
        super(color);
    }
    set narrow(n: number) {
        this._narrow = fixNumber(0, 8, n);
    }
    get narrow(): number {
        return this._narrow;
    }
    getNormalColor(): Rgba {
        return this.color;
    }
    getFamilyColor(): Rgba {
        return this.familyColor;
    }
    getEnergyColor(params: VisualiserParams): Rgba {
        return new Rgba(0, 0, 100, 255)
            .interpolate(
                new Rgba(255, 255, 0, 255),
                this.energy / params.energyDivider
            );
    }
    getAgeColor(params: VisualiserParams): Rgba {
        return new Rgba(150, 255, 255, 255)
            .interpolate(
                new Rgba(80, 80, 100, 255),
                this.age / params.ageDivider
            );
    }
    getLastActionColor(params: VisualiserParams): Rgba | null {
        if (this.genome.activeGene === null) return new Rgba(20, 20, 20, 255);
        if (!params.action[this.genome.activeGene.template.name]) {
            return new Rgba(20, 20, 20, 255)
        }
        const maybeColor = this.genome.activeGene.template.color;
        return maybeColor
            ? maybeColor
            : new Rgba(20, 20, 20, 255);
    }
    getChildrenAmountColor(params: VisualiserParams): Rgba | null {
        return new Rgba(20, 20, 150, 255)
            .interpolate(
                new Rgba(255, 0, 0, 255),
                this.childrenAmount / 10
            );
    }
    getAbilityColor(): Rgba | null {
        return new Rgba(240, 20, 20, 255)
            .interpolate(new Rgba(20, 240, 20, 255), this.abilities.photosynthesis);
    }
    getHealthColor(): Rgba {
        return new Rgba(100, 50, 50, 255)
            .interpolate(new Rgba(150, 200, 255, 255), this.health);
    }
    increaseAbility(ability: BotAbilityName) {
        for (const name in this.abilities) {
            if (Object.prototype.hasOwnProperty.call(this.abilities, name)) {
                this.abilities[name as BotAbilityName] = limit(
                    0,
                    1,
                    this.abilities[name as BotAbilityName] + (name === ability
                        ? 0.01
                        : -0.01
                    )
                );
            }
        }
    }
    onAttack(bot: Bot, value: number) {
        const REAL_VALUE = Math.min(this.energy, value);
        this.energy -= REAL_VALUE;
        bot.energy += REAL_VALUE;
        this.health -= 0.1;
        return REAL_VALUE;
    }
    onVirus(bot: Bot, pool: GenePool) {
        const pointer = this.genome.pointer;
        this.genome = bot.genome.replication(pool);
        this.genome.pointer = pointer;
        this.familyColor = bot.familyColor.mutateRgb(5);
    }
    multiply(pool: GenePool, energyCoef: number) {
        const energy = this.energy * energyCoef;
        this.energy -= energy;
        this.childrenAmount++;
        return new Bot(
            this.generation + 1,
            this.color.interpolate(new Rgba(255, 255, 255, 255), 0.1),
            this.familyColor.mutateRgb(5),
            energy,
            { ...this.abilities },
            this.genome.replication(pool)
        );
    }
    live(x: number, y: number, world: World) {
        if (
            this.age > 2000 ||
            this.energy < 1 ||
            this.energy > 300 ||
            this.health <= 0
        ) {
            this.alive = false;
            world.remove(x, y);
            // world.set(x, y, new Block(this.color.interpolate(new Rgba(0, 0, 0, 255), 0.5)));
            this.lastActions.push('Смерть');
            return;
        }
        this.lastActions = [];
        this.genome.doAction(this, x, y, world);
        this.age++;
        this.health = Math.min(1, this.health + 0.01);
    }
    Render = () => {
        const [age, setAge] = useState<number | string>(this.age);
        const [energy, setEnergy] = useState<number | string>(this.energy.toFixed(2));
        const [health, setHealth] = useState<number | string>(this.health.toFixed(2));

        useEffect(() => {
            setAge(this.age);
        }, [this.age]);

        useEffect(() => {
            setHealth(this.health.toFixed(2));
        }, [this.health]);

        useEffect(() => {
            setEnergy(this.energy.toFixed(2));
        }, [this.energy]);

        return (
            <>
                <SubBlock>
                    <b>Бот</b>
                </SubBlock>
                <SubBlock>
                    {this.alive ? <div>
                        <InputNumberSmall
                            name='Возраст'
                            value={age}
                            onChange={e => {
                                const age = e.target.value;
                                setAge(age);
                            }}
                            onBlur={e => {
                                const age = e.target.value;
                                if (age.length > 0) {
                                    this.age = parseFloat(age);
                                }
                                setAge(this.age);
                            }}
                        />
                        <InputNumberSmall
                            name='Здоровье'
                            value={health}
                            onChange={e => {
                                const health = e.target.value;
                                setHealth(health);
                            }}
                            onBlur={e => {
                                const health = e.target.value;
                                if (health.length > 0) {
                                    this.health = parseFloat(health);
                                }
                                setHealth(this.health);
                            }}
                        />
                        <InputNumberSmall
                            name='Энергия'
                            value={energy}
                            onChange={e => {
                                const energy = e.target.value;
                                setEnergy(energy);
                            }}
                            onBlur={e => {
                                const energy = e.target.value;
                                if (energy.length > 0) {
                                    this.energy = parseFloat(energy);
                                }
                                setEnergy(this.energy);
                            }}
                        />
                        <div>Потомков: {this.childrenAmount}</div>
                        <div>Направление: {narrowToName(this.narrow)}</div>
                        <div>Поколение: {this.generation}</div>
                    </div> : <div
                        style={{
                            color: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            border: '2px solid red',
                            lineHeight: '50px',
                            borderRadius: '5px',
                        }}>
                        Этот бот мёртв
                    </div>}
                </SubBlock>
                <SubBlock>
                    <this.genome.Render />
                </SubBlock>
                <Accordion name='Последние действия' small>
                    <LastActionsWrapper>
                        {this.lastActions.map((action, i) => {
                            return (
                                <div key={i} style={{ fontSize: '80%' }}>
                                    - {action}
                                </div>
                            );
                        })}
                    </LastActionsWrapper>
                </Accordion>
            </>
        );
    };
}

const LastActionsWrapper = styled.div`
    aspect-ratio: 1;
    padding: 5px;
    border-radius: 5px;
    background-color: #333;
    overflow-y: auto;
`;

function narrowToName(narrow: number) {
    switch (narrow) {
        case 0: return '↖';
        case 1: return '↑';
        case 2: return '↗';
        case 3: return '→';
        case 4: return '↘';
        case 5: return '↓';
        case 6: return '↙';
        case 7: return '←';
    }
}