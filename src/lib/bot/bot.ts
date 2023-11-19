import { MAX_BOT_AGE } from 'settings';
import { bindProps } from 'hoc';
import { Rgba } from 'lib/color';
import { Genome } from 'lib/genome';
import { cycleNumber, limit, randInt } from 'lib/helpers';

import { RenderBot } from './RenderBot';

import type { WorldBlockDynamic } from 'types';
import type { GenePool } from 'lib/genome';
import type { VisualiserParams } from 'lib/view-modes';
import type { World } from 'lib/world';

interface BotProps {
  generation: number,
  color: Rgba,
  familyColor: Rgba,
  energy: number,
  hunterFactor: number,
  genome: Genome
}

const defaultProps: BotProps = {
  generation: 0,
  energy: 0,
  color: new Rgba(0, 0, 0, 0),
  familyColor: new Rgba(0, 0, 0, 0),
  hunterFactor: 0,
  genome: new Genome(0)
};

export class Bot implements WorldBlockDynamic {
  readonly isDynamic = true;
  isAlive = true;
  lastActions: string[] = [];
  age = 0;
  childrenAmount = 0;
  color: Rgba;
  familyColor: Rgba;
  hunterFactor: number;
  generation: number;
  energy: number;
  genome: Genome;
  private _health = 0.5;
  private _narrow: number = randInt(0, 8) / 8 * Math.PI * 2;

  constructor(
    props: Partial<BotProps>
  ) {
    const p = { ...defaultProps, ...props };
    this.color = p.color;
    this.hunterFactor = p.hunterFactor;
    this.familyColor = p.familyColor;
    this.generation = p.generation;
    this.energy = p.energy;
    this.genome = p.genome;
  }
  get narrow(): number {
    return this._narrow;
  }
  get health() {
    return this._health;
  }
  set narrow(n: number) {
    this._narrow = cycleNumber(0, Math.PI * 2, n);
  }
  set health(health: number) {
    this._health = limit(0, 1, health);
  }
  getJustColor(): Rgba {
    return this.color;
  }
  getInformativeColor(): Rgba {
    return this.color
      .lerp(new Rgba(50, 50, 50, 255), Math.max(0, 1 - (this.energy / 10) ** (1 / 3)))
      .lerp(this.getFamilyColor(), 0.25);
  }
  getFamilyColor(): Rgba {
    return this.familyColor;
  }
  getEnergyColor(params: VisualiserParams): Rgba {
    return new Rgba(0, 0, 100, 255)
      .lerp(
        new Rgba(255, 255, 0, 255),
        this.energy / params.energyDivider
      );
  }
  getAgeColor(params: VisualiserParams): Rgba {
    return new Rgba(150, 255, 255, 255)
      .lerp(
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
      .lerp(
        new Rgba(255, 0, 0, 255),
        this.childrenAmount / 10
      );
  }
  getAbilityColor(): Rgba | null {
    return new Rgba(240, 20, 20, 255)
      .lerp(new Rgba(20, 240, 20, 255), 1 - this.hunterFactor);
  }
  getHealthColor(): Rgba {
    return new Rgba(100, 50, 50, 255)
      .lerp(new Rgba(150, 200, 255, 255), this.health);
  }
  increaseHunterFactor(value: number) {
    this.hunterFactor = limit(0, 1, this.hunterFactor + value);
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
    return new Bot({
      generation: this.generation + 1,
      color: this.color.lerp(new Rgba(255, 255, 255, 255), 0.1),
      familyColor: this.familyColor.mutateRgb(5),
      energy,
      hunterFactor: this.hunterFactor,
      genome: this.genome.replication(pool),
    });
  }
  live(x: number, y: number, world: World) {
    if (
      this.age >= MAX_BOT_AGE ||
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
  Render = bindProps(RenderBot, { bot: this });
}
