import { cycleNumber, randInt } from './helpers';

export type Coords = [number, number];

export class Grid<T> {
  private readonly cells: (T | undefined)[][];
  constructor(
    readonly width: number,
    readonly height: number
  ) {
    this.cells = new Array<T[]>(width);
    for (let x = 0; x < width; x++) {
      this.cells[x] = new Array(height).fill(undefined);
    }
  }
  cycleCoords(x: number, y: number): Coords {
    return [
      cycleNumber(0, this.width, x),
      cycleNumber(0, this.height, y),
    ];
  }
  randCoords(): [number, number] {
    return [
      randInt(0, this.width),
      randInt(0, this.height)
    ];
  }
  randEmpty(): [number, number] {
    let coords: [number, number] = [0, 0];
    do {
      coords = this.randCoords();
    } while (this.get(...coords));
    return coords;
  }
  fill(value: T | undefined) {
    this.cells.map(column => column.fill(value));
    return this;
  }
  get(x: number, y: number) {
    return this.cells[x]![y];
  }
  set(x: number, y: number, value: T | undefined) {
    this.cells[x]![y] = value;
  }
  remove(x: number, y: number) {
    delete this.cells[x]![y];
  }
  swap(x: number, y: number, x2: number, y2: number) {
    const bufferA = this.get(x, y);
    const bufferB = this.get(x2, y2);
    this.set(x, y, bufferB);
    this.set(x2, y2, bufferA);
  }
  flat(): (T | undefined)[] {
    return Array.prototype.concat.apply([], this.cells);
  }
}
