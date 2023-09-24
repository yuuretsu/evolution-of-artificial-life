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
  const dif = max - min;
  return max - min === 0 ? min : (number - min) / dif;
}

export function limit(
  min: number,
  max: number,
  number: number
): number {
  return Math.max(Math.min(number, max), min);
}

export function lerp(
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

export function numberToShortString(number: number, precision = 0) {
  if (number >= 1_000_000_000) {
    return (number / 1_000_000_000).toFixed(precision) + ' млрд.';
  } else if (number >= 1_000_000) {
    return (number / 1000000).toFixed(precision) + ' млн.';
  } else if (number >= 1_000) {
    return (number / 1000).toFixed(precision) + ' тыс.';
  } else {
    return parseFloat(number.toFixed(precision)).toString();
  }
}

const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const picked: Partial<Pick<T, K>> = {};
  keys.forEach(key => {
    picked[key] = obj[key];
  });
  return picked as Pick<T, K>;
};

export const getUserInfo = () => {
  return {
    ...pick(navigator, ['userAgent', 'language', 'maxTouchPoints', 'platform']),
    timeZone: new Date().toString(),
    screenSize: `${screen.width}x${screen.height}`,
    windowSize: `${innerWidth}x${innerHeight}`,
    referrer: document.referrer
  };
};

export const strJoin = (separator: string) => (input: (string | null | void | boolean)[]) => {
  return input.filter(Boolean).join(separator);
};
