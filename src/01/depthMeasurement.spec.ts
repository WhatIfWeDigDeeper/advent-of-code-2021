import * as fs from 'fs';
import * as path from 'path';

type Result = {
  count: number;
  previous: number | null;
};

type Predicate = (prev: number | null, curr: number) => boolean;

const getCount =
  (predicate: Predicate) =>
  (readings: number[]): number => {
    const result: Result = readings.reduce(
      (acc: Result, curr: number): Result => ({
        count: acc.count + (predicate(acc.previous, curr) ? 1 : 0),
        previous: curr,
      }),
      { count: 0, previous: null }
    );
    return result.count;
  };

const increasedCountPredicate = (
  previous: number | null,
  current: number
): boolean => previous !== null && current > previous;

const equalCountPredicate = (
  previous: number | null,
  current: number
): boolean => previous !== null && current === previous;

const getIncreasedCount = getCount(increasedCountPredicate);
const getEqualCount = getCount(equalCountPredicate);

test('given readings it should return number of increases', () => {
  const depthReadings = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

  expect(getIncreasedCount(depthReadings)).toBe(7);
});

test('given readings it should return number of equals', () => {
  const depthReadings = [199, 200, 200, 210, 200, 207, 269, 269, 269, 263];

  expect(getEqualCount(depthReadings)).toBe(3);
});

test('given actual test input it should return number of increases', () => {
  const filePath = path.join(__dirname, 'depths.txt');
  const depthReadings = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(Number);

  expect(getIncreasedCount(depthReadings)).toBe(1226);
});
