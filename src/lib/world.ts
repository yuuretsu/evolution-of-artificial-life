import Rgba from "./color";
import Grid, { Coords } from "./grid";
import { fixNumber, limit } from "./helpers";
import { BlockVisualiser, VisualiserParams } from "./view-modes";
import { Bot } from "./bot";
import { GenePool, Genome } from "./genome";
import { WorldBlockDynamic, WorldBlock } from "types";

export type NewWorldProps = {
  width: number;
  height: number;
  botsAmount: number;
  genePool: GenePool;
  genomeSize: number;
};

export type WorldInfo = {
  cycle: number;
  dynamicBlocks: number;
  stepTime: number;
};

export abstract class World extends Grid<WorldBlock> {
  protected info: WorldInfo = {
    cycle: 0,
    dynamicBlocks: 0,
    stepTime: 0
  };
  genePool: GenePool;
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
  static readonly moore_neighbourhood: Coords[] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ];
  constructor(props: NewWorldProps) {
    super(props);
    const amount = limit(0, this.width * this.height, props.botsAmount);
    for (let i = 0; i < amount; i++) {
      this.set(
        ...this.randEmpty(),
        new Bot(
          0,
          new Rgba(100, 100, 100, 255),
          Rgba.randRgb(),
          100,
          { photosynthesis: 0.5, attack: 0.5 },
          new Genome(props.genomeSize).fillRandom(props.genePool)
        )
      );
      this.info.dynamicBlocks++;
    }
  }
  narrowToCoords(x: number, y: number, narrow: number, length: number) {
    narrow = fixNumber(0, 8, narrow);
    const x2 = x + SquareWorld.moore_neighbourhood[narrow]![0] * length;
    const y2 = y + SquareWorld.moore_neighbourhood[narrow]![1] * length;
    return this.fixCoords(x2, y2);
  }
  getInfo() {
    return { ...this.info };
  }
  step() {
    const start = performance.now();
    // this.info.dynamicBlocks = 0;
    const filtered: { pos: Coords; obj: WorldBlockDynamic }[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const obj = this.get(x, y);
        if (obj?.isDynamic) filtered.push({ pos: [x, y], obj });
      }
    }
    // filtered.sort(() => Math.random() - 0.5);
    shuffle(filtered);
    for (const object of filtered) {
      object.obj.live(...object.pos, this);
    }
    this.info.dynamicBlocks = this.flat().filter(
      (value) => value?.isDynamic
    ).length;
    this.info.cycle++;
    this.info.stepTime = performance.now() - start;
  }
  toImage(visualizer: BlockVisualiser, params: VisualiserParams) {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D) {
      const data = ctx.createImageData(this.width, this.height);
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          const obj = this.get(x, y);
          const color = obj ? visualizer(obj, params) : null;
          if (color) {
            const POINTER = (y * this.width + x) * 4;
            data.data[POINTER] = color.red;
            data.data[POINTER + 1] = color.green;
            data.data[POINTER + 2] = color.blue;
            data.data[POINTER + 3] = color.alpha;
          }
        }
      }
      ctx.putImageData(data, 0, 0);
      return canvas;
    } else {
      throw "Не удалось получить контекст из канваса";
    }
  }
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex]!, array[randomIndex]!] = [
      array[randomIndex]!, array[currentIndex]!];
  }

  return array;
}