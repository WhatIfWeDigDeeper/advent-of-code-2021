import * as fs from 'fs';
import * as path from 'path';
import { compose } from 'lodash/fp';

type Bit = 0 | 1;

type Bits = Bit[];

type Epsilon = Bits;
type Gamma = Bits;

type Diagnostic = {
  epsilonRate: Epsilon;
  gammaRate: Gamma;
};

function readInput(fileName: string): Bits[] {
  const filePath = path.join(__dirname, fileName);
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((bits: string) =>
      bits.split('').map((bit) => parseInt(bit, 2))
    ) as Bits[];
}

// sum each position of the input
// divide sum by length of input
// is sum > half of length
// gammaPosition = 1, epsilonPosition = 0
// else gammaPosition = 0, epsilonPosition = 1
function analyzeInput(readings: Bits[]): Diagnostic {
  const numberOfBits = readings[0].length;
  const sums = readings.reduce((acc: number[], currBits: Bits) => {
    currBits.forEach((bit: Bit, index: number) => {
      acc[index] += bit;
    });
    return acc;
  }, new Array(numberOfBits).fill(0));
  const result: Diagnostic = {
    epsilonRate: new Array(numberOfBits).fill(0),
    gammaRate: new Array(numberOfBits).fill(0),
  };
  sums.forEach((sum, i) => {
    if (sum > readings.length / 2) {
      result.gammaRate[i] = 1;
      result.epsilonRate[i] = 0;
    } else {
      result.gammaRate[i] = 0;
      result.epsilonRate[i] = 1;
    }
  });
  return result;
}

const calculatePowerConsumption = (diagnostic: Diagnostic): number =>
  parseInt(diagnostic.epsilonRate.join(''), 2) *
  parseInt(diagnostic.gammaRate.join(''), 2);

const runDiagnostics = compose(
  calculatePowerConsumption,
  analyzeInput,
  readInput
);

test('example', () => {
  const fileInput = [
    '00100',
    '11110',
    '10110',
    '10111',
    '10101',
    '01111',
    '00111',
    '11100',
    '10000',
    '11001',
    '00010',
    '01010',
  ];
  const readings = fileInput
    .map((line) => line.split(''))
    .map((bits) => bits.map((bit) => parseInt(bit, 2))) as Bits[];
  const diagnostic: Diagnostic = analyzeInput(readings);

  expect(calculatePowerConsumption(diagnostic)).toEqual(198);
});

test('example file', () => {
  expect(runDiagnostics('sample.txt')).toEqual(198);
});

test('exercise', () => {
  expect(runDiagnostics('input.txt')).toEqual(3985686);
});
