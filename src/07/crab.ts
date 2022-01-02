import { readAllLines } from '../fileUtils';

type CalculateFuelCost = (positions: number[], alignment: number) => number;

const calculateStandardFuelCost = (
  positions: number[],
  alignment: number
): number =>
  positions.reduce((acc, position) => acc + Math.abs(position - alignment), 0);

function sumFuel(steps: number): number {
  let fuelTotal = 0;
  for (let i = 1; i <= steps; i++) {
    fuelTotal += i;
  }
  return fuelTotal;
  // this was too inefficient
  // return steps === 0
  //   ? 0
  //   : createRange(steps, 1).reduce((acc, step) => acc + step, 0);
}

export const calculateProgressiveFuelCost = (
  positions: number[],
  alignment: number
): number =>
  positions.reduce(
    (acc, position) => acc + sumFuel(Math.abs(position - alignment)),
    0
  );

function range(size: number, startAt = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export function calculateEfficientAlignmentFuelCost(
  fileName: string,
  calculateFuelCost: CalculateFuelCost
): number {
  const positions: number[] = readAllLines(`07/${fileName}`)[0]
    .split(',')
    .map(Number)
    .sort((a, b) => a - b);
  const min = positions[0];
  const max = positions[positions.length - 1];

  return range(max - min + 1, min).reduce((acc, rangeIndex) => {
    const fuelCost = calculateFuelCost(positions, rangeIndex);
    return fuelCost < acc ? fuelCost : acc;
  }, Number.MAX_SAFE_INTEGER);
}

export function calculateEfficientAlignmentStandardFuelCost(
  fileName: string
): number {
  return calculateEfficientAlignmentFuelCost(
    fileName,
    calculateStandardFuelCost
  );
}

export function calculateEfficientAlignmentProgressiveFuelCost(
  fileName: string
): number {
  return calculateEfficientAlignmentFuelCost(
    fileName,
    calculateProgressiveFuelCost
  );
}
