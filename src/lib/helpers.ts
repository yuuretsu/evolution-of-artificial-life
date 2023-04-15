export function* range(from: number, to: number) {
  while (from < to) {
    yield from++;
  }
}

export function randFloat(bottom: number, top: number) {
  return Math.random() * (top - bottom) + bottom;
}

export function randInt(bottom: number, top: number) {
  return Math.floor(randFloat(bottom, top));
}

export function randChoice<T>(arr: T[]) {
  return arr[randInt(0, arr.length)];
}

export function fixNumber(min: number, max: number, number: number) {
  const range = max - min;
  return (((number - min) % range) + range) % range + min;
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

export function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i]!, array[randomIndex]!] = [array[randomIndex]!, array[i]!];
  }
  return array;
}
