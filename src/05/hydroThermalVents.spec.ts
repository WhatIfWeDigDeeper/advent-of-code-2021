import { calculateDangerousVentCount } from './hydroThermalVents';

test('read sample input from file', () => {
  const dangerousVentCount = calculateDangerousVentCount('05/sample.txt');
  expect(dangerousVentCount).toBe(5);
});

test('exercise file', () => {
  const dangerousVentCount = calculateDangerousVentCount('05/input.txt');
  expect(dangerousVentCount).toBe(6005);
});
