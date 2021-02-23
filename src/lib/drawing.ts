import { interpolate, limNumber, randFloat, randInt } from "./math-functions";

export class Rgba {
    private static readonly MAX_DIF = 255 * 4;
    static randRgb(): Rgba {
        return new Rgba(randInt(0, 256), randInt(0, 256), randInt(0, 256), 255);
    }
    constructor(
        readonly red: number,
        readonly green: number,
        readonly blue: number,
        readonly alpha: number
    ) { }
    interpolate(other: Rgba, t: number): Rgba {
        return new Rgba(
            interpolate(this.red, other.red, t),
            interpolate(this.green, other.green, t),
            interpolate(this.blue, other.blue, t),
            interpolate(this.alpha, other.alpha, t)
        );
    }
    normalise(): Rgba {
        return new Rgba(
            limNumber(0, 255, this.red),
            limNumber(0, 255, this.green),
            limNumber(0, 255, this.blue),
            limNumber(0, 255, this.alpha)
        );
    }
    mutateRgb(value: number): Rgba {
        return new Rgba(
            this.red + randFloat(-value, value),
            this.green + randFloat(-value, value),
            this.blue + randFloat(-value, value),
            this.alpha
        ).normalise();
    }
    difference(other: Rgba): number {
        return ((
            Math.abs(this.red - other.red) +
            Math.abs(this.green - other.green) +
            Math.abs(this.blue - other.blue) +
            Math.abs(this.alpha - other.alpha)
        ) / Rgba.MAX_DIF);
    }
}

export class Canvas {
    readonly node: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    constructor(width: number, height: number, node?: HTMLCanvasElement) {
        this.node = node || document.createElement("canvas");
        this.node.width = width;
        this.node.height = height;
        this.ctx = this.node.getContext("2d") as CanvasRenderingContext2D;
    }
}

export class PixelsData extends Canvas {
    readonly data: ImageData;
    constructor(width: number, height: number, node?: HTMLCanvasElement) {
        super(width, height, node);
        this.data = this.ctx.getImageData(
            0,
            0,
            this.node.width,
            this.node.height
        );
    }
    setPixel(x: number, y: number, color: Rgba) {
        const POINTER = (y * this.data.width + x) * 4;
        this.data.data[POINTER] = color.red;
        this.data.data[POINTER + 1] = color.green;
        this.data.data[POINTER + 2] = color.blue;
        this.data.data[POINTER + 3] = color.alpha;
    }
    update() {
        this.ctx.putImageData(this.data, 0, 0);
        return this;
    }
}
