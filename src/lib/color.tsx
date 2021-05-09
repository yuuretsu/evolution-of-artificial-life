import { interpolate, limit, randFloat } from "./helpers";

export default class Rgba {
    private static readonly MAX_DIF = 255 * 4;
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
            limit(0, 255, this.red),
            limit(0, 255, this.green),
            limit(0, 255, this.blue),
            limit(0, 255, this.alpha)
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
    toArray(): [number, number, number, number] {
        return [this.red, this.green, this.blue, this.alpha];
    }
    toString(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha / 255})`;
    }
}