import { readAllLines } from '../fileUtils';

const calculateFuelCost = (positions: number[], alignment: number): number =>
  positions.reduce((acc, position) => acc + Math.abs(position - alignment), 0);

export function calculateEfficientAlignmentFuelCost(fileName: string): number {
  const positions: number[] = readAllLines(`07/${fileName}`)[0]
    .split(',')
    .map(Number)
    .sort((a, b) => a - b);
  return positions.reduce((acc, position) => {
    const fuelCost = calculateFuelCost(positions, position);
    return fuelCost < acc ? fuelCost : acc;
  }, Number.MAX_SAFE_INTEGER);
}
