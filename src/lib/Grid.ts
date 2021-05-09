import { fixNumber, randInt } from "./helpers";

export type Coords = [number, number];

type CallbackFn<T, U> = (obj: T | undefined, x: number, y: number) => U;

export default class Grid<T> {
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
    fixCoords(x: number, y: number): Coords {
        return [
            fixNumber(0, this.width, x),
            fixNumber(0, this.height, y),
        ];
    }
    randCoords(): [number, number] {
        return [
            randInt(0, this.width),
            randInt(0, this.height)
        ];
    }
    randEmpty(): [number, number] {
        let coords: [number, number];
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
    getOr(x: number, y: number, value: T) {
        const here = this.cells[x]![y];
        return here !== undefined
            ? here
            : value;
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
    forEach(func: CallbackFn<T, any>) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                func(this.get(x, y), x, y);
            }
        }
    }
    map(func: CallbackFn<T, T>): Grid<T> {
        const next = new Grid<T>(this.width, this.height);
        this.forEach((value, x, y) => {
            next.set(x, y, func(value, x, y))
        });
        return next;
    }
    flat(): (T | undefined)[] {
        return Array.prototype.concat.apply([], this.cells)
    }
}