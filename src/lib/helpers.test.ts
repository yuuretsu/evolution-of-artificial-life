import { test, expect } from 'vitest';

import { cycleNumber, lerp, limit, normalizeNumber, numberToShortString, pick, strJoin } from './helpers';

test(cycleNumber.name, () => {
  expect(cycleNumber(0, 10, 5)).toEqual(5);
  expect(cycleNumber(0, 10, 10)).toEqual(0);
  expect(cycleNumber(5, 10, 0)).toEqual(5);
  expect(cycleNumber(2, 10, 40)).toEqual(8);
  expect(cycleNumber(0, 10, -1)).toEqual(9);
  expect(cycleNumber(0, 10, -10)).toEqual(0);
});

test(normalizeNumber.name, () => {
  expect(normalizeNumber(0, 10, 5)).toEqual(0.5);
  expect(normalizeNumber(0, 0.5, 1)).toEqual(2);
  expect(normalizeNumber(1, 2, 1.5)).toEqual(0.5);
  expect(normalizeNumber(1, 2, 0.5)).toEqual(-0.5);
  expect(normalizeNumber(1, 1, 1)).toEqual(1);
  expect(normalizeNumber(-1, 1, 0)).toEqual(0.5);
});

test(limit.name, () => {
  expect(limit(-3, 10, 5)).toEqual(5);
  expect(limit(-3, 10, -12)).toEqual(-3);
  expect(limit(-3, 12.3, 13)).toEqual(12.3);
});

test(lerp.name, () => {
  expect(lerp(0, 2, 0.5)).toEqual(1);
  expect(lerp(1, 2, 0.5)).toEqual(1.5);
  expect(lerp(-10, 10, 0.5)).toEqual(0);
  expect(lerp(0.1, 1, 10)).toEqual(9.1);
  expect(lerp(0.1, -1, 10)).toEqual(-10.9);
});

test(numberToShortString.name, () => {
  expect(numberToShortString(1000)).toEqual('1 тыс.');
  expect(numberToShortString(1234, 1)).toEqual('1.2 тыс.');
  expect(numberToShortString(103131444.5, 3)).toEqual('103.131 млн.');
  expect(numberToShortString(1.523432, 2)).toEqual('1.52');
  expect(numberToShortString(1.001, 2)).toEqual('1');
  expect(numberToShortString(-0.001, 2)).toEqual('0');
});

test(pick.name, () => {
  expect(pick({ fieldA: 'value a', fieldB: 'value b' }, ['fieldA'])).toEqual({ fieldA: 'value a' });
});

test(strJoin.name, () => {
  expect(strJoin('+')(['a', 'b', 'c'])).toEqual('a+b+c');
  expect(strJoin('+')(['a', false && 'b', 'c'])).toEqual('a+c');
});
