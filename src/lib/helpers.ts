import { createEvent, createStore, sample } from 'effector';
import { useUnit } from 'effector-react';

import type { EventCallable, StoreWritable } from 'effector';
import type { ChangeEvent } from 'react';

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

export function cycleNumber(min: number, max: number, num: number): number {
  const range = max - min;
  const normalizedNum = (num - min) % range;
  return normalizedNum >= 0 ? normalizedNum + min : normalizedNum + max;
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
  const numericSuffixPairs: [number, string][] = [
    [1_000_000_000, 'млрд.'],
    [1_000_000, 'млн.'],
    [1_000, 'тыс.']
  ];

  const formatNumber = (value: number) => parseFloat(value.toFixed(precision)).toString();

  for (const [divisor, postfix] of numericSuffixPairs) {
    if (number >= divisor) return `${formatNumber(number / +divisor)} ${postfix}`;
  }

  return formatNumber(number);
}

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
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

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let lastExec = 0;
  let result: ReturnType<T>;

  return function (...args: Parameters<T>): ReturnType<T> {
    const curTime = Date.now();

    if (curTime - lastExec > delay) {
      lastExec = curTime;
      result = func(...args);
    }
    return result;
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T | null | undefined,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func?.(...args);
    }, delay);
  };
};

export const connectForm = <T>($s: StoreWritable<T>, toString: (t: T) => string, fromString: (s: string) => T | undefined) => {
  const set = createEvent<string>();
  const $value = $s.map(x => toString(x));

  $s.on(set, (_, s) => fromString(s));

  const use = () => {
    return useUnit({
      value: $value,
      onChange: set.prepend<ChangeEvent<{ value: string }>>((e) => e.target.value)
    });
  };

  return {
    set,
    $value,
    use
  };
};

export interface ToggleStore {
  $isEnabled: StoreWritable<boolean>;
  set: EventCallable<boolean>;
  toggle: EventCallable<void>;
  open: EventCallable<void>;
  close: EventCallable<void>;
}

export const createToggleStore = (initial: boolean): ToggleStore => {
  const set = createEvent<boolean>();
  const toggle = createEvent();
  const open = set.prepend(() => true);
  const close = set.prepend(() => false);

  const $isEnabled = createStore(initial)
    .on(set, (_, value) => value);

  sample({
    source: $isEnabled,
    clock: toggle,
    fn: (x) => !x,
    target: set
  });

  return {
    $isEnabled,
    set,
    toggle,
    open,
    close
  };
};