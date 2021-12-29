import { calculateEfficientAlignmentFuelCost } from './crab';

test('sample', () => {
  const actual = calculateEfficientAlignmentFuelCost('sample.txt');
  expect(actual).toEqual(37);
});

test('input', () => {
  const actual = calculateEfficientAlignmentFuelCost('input.txt');
  expect(actual).toEqual(336721);
});
