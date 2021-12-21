import { calculateDangerousVentCount } from './hydroThermalVents';

type TestInput = {
  file: string;
  includeDiagonals: boolean;
  expected: number;
};

test.each([
  { file: 'sample.txt', includeDiagonals: false, expected: 5 },
  { file: 'sample.txt', includeDiagonals: true, expected: 12 },
  { file: 'input.txt', includeDiagonals: false, expected: 6005 },
  { file: 'input.txt', includeDiagonals: true, expected: 23837 },
])('for %s', (input: TestInput) => {
  const dangerousVentCount = calculateDangerousVentCount(
    `05/${input.file}`,
    input.includeDiagonals
  );
  expect(dangerousVentCount).toEqual(input.expected);
});
