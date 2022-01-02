import {
  calculateEfficientAlignmentProgressiveFuelCost,
  calculateEfficientAlignmentStandardFuelCost,
} from './crab';

describe('part 1 standard fuel cost', (): void => {
  test('sample', () => {
    const actual = calculateEfficientAlignmentStandardFuelCost('sample.txt');
    expect(actual).toEqual(37);
  });

  test('input', () => {
    const actual = calculateEfficientAlignmentStandardFuelCost('input.txt');
    expect(actual).toEqual(336721);
  });
});

describe('part 2 progressive fuel cost', (): void => {
  test('sample', () => {
    const actual = calculateEfficientAlignmentProgressiveFuelCost('sample.txt');
    expect(actual).toEqual(168);
  });

  test('input', () => {
    const actual = calculateEfficientAlignmentProgressiveFuelCost('input.txt');
    expect(actual).toEqual(91638945);
  });
});
