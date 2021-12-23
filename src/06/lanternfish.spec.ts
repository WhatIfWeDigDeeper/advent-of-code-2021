import { calculateLanternfishCount } from './lanternfish';

test('sample input, 18 days', () => {
  expect(calculateLanternfishCount('sample.txt', 18)).toEqual(26);
});

test('sample input, 80 days', () => {
  expect(calculateLanternfishCount('sample.txt', 80)).toEqual(5934);
});

test('exercise', () => {
  expect(calculateLanternfishCount('input.txt', 80)).toEqual(362639);
});
