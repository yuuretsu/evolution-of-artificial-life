import { BotProfile } from 'widgets/bot-profile';
import { BotGenome } from 'widgets/bot-genome';

import { Bot } from '../bot';
import { Rgba } from '../color';
import { Genome } from '../genome';
import { Grid } from '../grid';
import { limit, shuffle } from '../helpers';
import { geneNameToGene } from '../genome/genes';

import type { GeneName } from '../genome';
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
    const [x2, y2] = [
      Math.cos(angle) * length + x,
      Math.sin(angle) * length + y
    ].map(Math.round);

    return this.cycleCoords(x2!, y2!);
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
    for (const [x, y] of this.getAllCoords()) {
      const obj = this.get(x, y);
      if (obj?.isDynamic) filtered.push({ pos: [x, y], obj });
    }
    shuffle(filtered);
    for (const object of filtered) {
      object.obj.live(...object.pos, this);
    }
    const bots = filtered
      .map(({ obj }) => obj)
      .filter((obj): obj is Bot => obj instanceof Bot);
    const averageAge = bots.map(({ age }) => age).reduce((a, b) => a + b, 0) / bots.length || 0;
    const maxGeneration = bots.map(({ generation }) => generation).reduce((a, b) => Math.max(a, b), 0);
    this.info.dynamicBlocks = this.flat().filter(
      (value) => value?.isDynamic
    ).length;
    this.info.cycle++;
    this.info.stepTime = performance.now() - start;
    this.info.averageAge = averageAge;
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
