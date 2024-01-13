import { PixelsCanvas } from '@yuuretsu/pixels-canvas';

import { Bot } from './bot';
import { Rgba } from './color';
import { Genome } from './genome';
import { Grid } from './grid';
import { limit, shuffle } from './helpers';
import { geneNameToGene } from './genome/genes';

import type { GeneName } from './genome';
import type { Coords } from './grid';
import type { BlockVisualiser, VisualiserParams } from './view-modes';
import type { WorldBlock, WorldBlockDynamic } from 'types';

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

export abstract class World extends Grid<WorldBlock> {
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
  }
  abstract toImage(
    visualizer: BlockVisualiser,
    params: VisualiserParams
  ): HTMLCanvasElement;
  abstract step(): void;
  abstract getInfo(): WorldInfo;
  abstract narrowToCoords(
    x: number,
    y: number,
    narrow: number,
    length: number
  ): Coords;
}

export class SquareWorld extends World {
  constructor(props: NewWorldProps) {
    super(props);
    const amount = limit(0, this.width * this.height, props.botsAmount);
    for (let i = 0; i < amount; i++) {
      this.set(
        ...this.randEmpty(),
        new Bot({
          color: new Rgba(100, 100, 100),
          familyColor: Rgba.randRgb(),
          energy: 100,
          hunterFactor: 0.5,
          genome: new Genome(props.genomeSize).fillRandom(props.genePool.map(geneNameToGene))
        })
      );
    }
  }
  narrowToCoords(x: number, y: number, angle: number, length: number) {
    const [x2, y2] = [
      Math.cos(angle) * length + x,
      Math.sin(angle) * length + y
    ].map(Math.round);

    return this.cycleCoords(x2!, y2!);
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
  toImage(visualizer: BlockVisualiser, params: VisualiserParams) {
    const canvas = document.createElement('canvas');
    const pix = new PixelsCanvas({
      width: this.width,
      height: this.height,
      pixelSize: 1,
      canvas
    });

    const colTransparent = new Rgba(0, 0, 0);
    const pixels = pix.getPixels();
    for (const [x, y] of this.getAllCoords()) {
      const obj = this.get(x, y);
      const color = obj ? visualizer(obj, params) || colTransparent : colTransparent;
      pixels[y]![x] = color.toArray();
    }

    pix.setPixels(pixels, 0, 0);
    return pix.canvas;
  }
}
