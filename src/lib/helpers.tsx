export function* range(from: number, to: number) {
    while (from < to) {
        yield from++;
    }
}

export function copy<T>(value: T) {
    return Object.assign<T, T>(Object.create(Object.getPrototypeOf(value)), value);
}

export function randFloat(bottom: number, top: number) {
    return Math.random() * (top - bottom) + bottom;
}

export function randInt(bottom: number, top: number) {
    return Math.floor(randFloat(bottom, top));
}

export function randChoice<T>(arr: T[]): T {
    return arr[randInt(0, arr.length)]!;
}

export function fixNumber(
    min: number,
    max: number,
    number: number
): number {
    return number >= min
        ? number % max
        : max - (-number % max);
}

export function normalizeNumber(
    min: number,
    max: number,
    number: number
): number {
    return (number - min) / (max - min);
}

export function limit(
    min: number,
    max: number,
    number: number
): number {
    return Math.max(Math.min(number, max), min);
}

export function interpolate(
    a: number,
    b: number,
    t: number
): number {
    return a + (b - a) * t;
}
