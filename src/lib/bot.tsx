import { useEffect, useState } from 'react';
import { MAX_BOT_AGE } from 'settings';
import styled from 'styled-components';
import { FlexRow, SubBlock } from 'ui';
import { Accordion, InputNumberSmall } from 'ui';

import { Rgba } from './color';
import { fixNumber, limit, randInt } from './helpers';

import type { GenePool, Genome } from './genome';
import type { VisualiserParams } from './view-modes';
import type { World } from './world';
import type { WorldBlockDynamic } from 'types';

export type BotAbilityName = keyof typeof Bot.prototype.abilities;

export class Bot implements WorldBlockDynamic {
  readonly isDynamic = true;
  isAlive = true;
  lastActions: string[] = [];
  age = 0;
  health = 0.5;
  childrenAmount = 0;
  private _narrow: number = randInt(0, 8) / 8 * Math.PI * 2;

  constructor(
    public generation: number,
    public color: Rgba,
    public familyColor: Rgba,
    public energy: number,
    public abilities: {
      photosynthesis: number,
      attack: number
    },
    public genome: Genome
  ) {
  }
  get narrow(): number {
    return this._narrow;
  }
  set narrow(n: number) {
    this._narrow = fixNumber(0, Math.PI * 2, n);
  }
  getJustColor(): Rgba {
    return this.color;
  }
  getInformativeColor(): Rgba {
    return this.color
      .interpolate(new Rgba(50, 50, 50, 255), Math.max(0, 1 - (this.energy / 10) ** (1 / 3)))
      .interpolate(this.getFamilyColor(), 0.25);
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
      return new Rgba(20, 20, 20, 255);
    }
    const maybeColor = this.genome.activeGene.template.color;
    return maybeColor
      ? maybeColor
      : new Rgba(20, 20, 20, 255);
  }
  getChildrenAmountColor(): Rgba | null {
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
  onAttack(value: number) {
    const REAL_VALUE = Math.min(this.energy, value);
    this.energy -= REAL_VALUE;
    this.health -= 0.1;
    return REAL_VALUE;
  }
  onVirus(genome: Genome, color: Rgba) {
    const pointer = this.genome.pointer;
    this.genome = genome;
    this.genome.pointer = pointer;
    this.familyColor = color;
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
      this.age > MAX_BOT_AGE ||
      this.energy <= 0 ||
      this.energy > 300 ||
      this.health <= 0
    ) {
      this.isAlive = false;
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

    const narrowArrowStyle = {
      transform: `rotate(${this.narrow.toFixed(1)}rad)`,
      display: 'inline-block'
    };

    return (
      <>
        <SubBlock>
          <FlexRow alignItems='center' gap={10}>
            <Avatar style={{ backgroundColor: this.color.toString() }} />
            <b>Бот</b>
          </FlexRow>
        </SubBlock>
        <SubBlock>
          {this.isAlive ? (
            <div>
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
              <div>
                Направление: <div style={narrowArrowStyle}>→</div>
              </div>
              <div>Поколение: {this.generation}</div>
            </div>
          ) : (
            <div
              style={{
                color: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                fontWeight: 'bold',
                textAlign: 'center',
                border: '2px solid red',
                lineHeight: '50px',
                borderRadius: '5px',
              }}
            >
              Этот бот мёртв
            </div>
          )}
        </SubBlock>
        <SubBlock>
          <this.genome.Render />
        </SubBlock>
        <Accordion name='Последние действия' isSmall>
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

const Avatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 2px;
`;
