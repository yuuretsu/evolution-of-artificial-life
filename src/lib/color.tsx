import { lerp, limit, randFloat, randInt } from './helpers';

export class Rgba {
  private static readonly MAX_DIF = 255 * 4;

  constructor(
    readonly red: number,
    readonly green: number,
    readonly blue: number,
    readonly alpha: number = 255
  ) { }

  static randRgb() {
    return new Rgba(
      randInt(0, 256),
      randInt(0, 256),
      randInt(0, 256),
      255
    );
  }
  lerp(other: Rgba, t: number): Rgba {
    return new Rgba(
      lerp(this.red, other.red, t),
      lerp(this.green, other.green, t),
      lerp(this.blue, other.blue, t),
      lerp(this.alpha, other.alpha, t)
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
