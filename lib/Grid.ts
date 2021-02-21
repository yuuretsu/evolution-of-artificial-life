import { fixNumber, randInt } from "./math-functions";

export default class Grid<T> {
    private readonly cells: (T | undefined)[][];
    constructor(readonly width: number, readonly height: number) {
        this.cells = [];
        for (let x = 0; x < width; x++) {
            this.cells[x] = [];
        }
    }
    get(x: number, y: number): T | undefined {
        return this.cells[x][y];
    }
    set(x: number, y: number, value: T | undefined) {
        this.cells[x][y] = value;
    }
    remove(x: number, y: number) {
        delete this.cells[x][y];
    }
    swap(x: number, y: number, x2: number, y2: number) {
        const bufferA = this.get(x, y);
        const bufferB = this.get(x2, y2);
        this.set(x, y, bufferB);
        this.set(x2, y2, bufferA);
    }
    fixCoords(x: number, y: number): [number, number] {
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
}
