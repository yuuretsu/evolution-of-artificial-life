import { BotProfile } from 'widgets/bot-profile';
import { BotGenome } from 'widgets/bot-genome';

import { Bot } from '../bot';
import { Rgba } from '../color';
import { Genome } from '../genome';
import { Grid } from '../grid';
import { limit, shuffle } from '../helpers';
import { geneNameToGene } from '../genome/genes';

import type { GeneName, GenePool } from '../genome';
import type { Coords } from '../grid';
import type { BlockVisualiser, VisualiserParams } from '../view-modes';
import type { WorldBlock, WorldBlockDynamic } from 'shared/types';

export type NewWorldProps = {
  width: number;
  height: number;
  botsAmount: number;
  genePool: GeneName[];
  genomeSize: number;
};

export type WorldInfo = {
  cycle: number;
  dynamicBlocks: number;
  stepTime: number;
  averageAge: number;
  maxGeneration: number;
};

export class SquareWorld extends Grid<WorldBlock> {
  genePool: GeneName[];
  /** Кэшированный массив объектов генов (пересчитывается при смене genePool) */
  genePoolResolved: GenePool = [];
  protected info: WorldInfo = {
    cycle: 0,
    dynamicBlocks: 0,
    stepTime: 0,
    averageAge: 0,
    maxGeneration: 0,
  };
  constructor(props: NewWorldProps) {
    super(props.width, props.height);
    this.genePool = props.genePool;
    this.genePoolResolved = props.genePool.map(geneNameToGene);
    const amount = limit(0, this.width * this.height, props.botsAmount);
    for (let i = 0; i < amount; i++) {
      const [x, y] = this.randEmpty();

      const genome = new Genome(props.genomeSize, BotGenome)
        .fillRandom(props.genePool.map(geneNameToGene));

      const bot = new Bot({
        color: new Rgba(100, 100, 100),
        familyColor: Rgba.randRgb(),
        energy: 100,
        hunterFactor: 0.5,
        genome,
        Component: BotProfile,
      });

      this.set(x, y, bot);
    }
  }
  narrowToCoords(x: number, y: number, angle: number, length: number) {
    const x2 = Math.round(Math.cos(angle) * length + x);
    const y2 = Math.round(Math.sin(angle) * length + y);
    return this.cycleCoords(x2, y2);
  }
  getByNarrow(x: number, y: number, angle: number, length: number): [[number, number], WorldBlock | void] {
    const [x2, y2] = this.narrowToCoords(x, y, angle, length);
    return [[x2, y2], this.get(x2, y2)];
  }
  getInfo(): WorldInfo {
    return { ...this.info };
  }
  step() {
    const start = performance.now();
    const filtered: { pos: Coords; obj: WorldBlockDynamic }[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const obj = this.get(x, y);
        if (obj?.isDynamic) filtered.push({ pos: [x, y], obj });
      }
    }
    shuffle(filtered);
    for (const object of filtered) {
      object.obj.live(...object.pos, this);
    }
    let totalAge = 0;
    let maxGeneration = 0;
    let botCount = 0;
    for (const { obj } of filtered) {
      if (obj instanceof Bot) {
        totalAge += obj.age;
        if (obj.generation > maxGeneration) maxGeneration = obj.generation;
        botCount++;
      }
    }
    this.info.dynamicBlocks = filtered.length;
    this.info.cycle++;
    this.info.stepTime = performance.now() - start;
    this.info.averageAge = botCount > 0 ? totalAge / botCount : 0;
    this.info.maxGeneration = Math.max(this.info.maxGeneration, maxGeneration);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSunlight(_x: number, _y: number) {
    return 1;
  }
  toImage(visualizer: BlockVisualiser, params: VisualiserParams) {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) throw new Error('Failed to create 2d context');
    ctx.canvas.width = this.width;
    ctx.canvas.height = this.height;
    const imageData = ctx.createImageData(this.width, this.height);


    const colTransparent = new Rgba(0, 0, 0);
    for (const [x, y] of this.getAllCoords()) {
      const obj = this.get(x, y);
      const color = obj ? visualizer(obj, params) || colTransparent : colTransparent;
      const pointer = (y * this.width + x) * 4;
      imageData.data[pointer] = color.red;
      imageData.data[pointer + 1] = color.green;
      imageData.data[pointer + 2] = color.blue;
      imageData.data[pointer + 3] = color.alpha;
    }

    ctx.putImageData(imageData, 0, 0);
    return ctx.canvas;
  }
}
