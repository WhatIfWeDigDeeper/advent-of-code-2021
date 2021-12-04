import * as fs from 'fs';
import * as path from 'path';
import { compose } from 'lodash/fp';

type Direction = 'down' | 'up' | 'forward';

type Move = {
  direction: Direction;
  distance: number;
};

type Position = {
  horizontal: number;
  depth: number;
};

function moveSub(movements: Move[]): Position {
  return movements.reduce(
    (acc, move): Position => {
      switch (move.direction) {
        case 'down':
          return {
            horizontal: acc.horizontal,
            depth: acc.depth + move.distance,
          };
        case 'up':
          return {
            horizontal: acc.horizontal,
            depth: acc.depth - move.distance,
          };
        case 'forward':
          return {
            horizontal: acc.horizontal + move.distance,
            depth: acc.depth,
          };
        default:
          return acc;
      }
    },
    { horizontal: 0, depth: 0 }
  );
}

const readInput = (fileName: string): Move[] => {
  const filePath = path.join(__dirname, fileName);
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((line) => {
      const move: string[] = line.split(' ');
      if (move.length !== 2) {
        console.error(`Invalid input: ${line}`);
        return undefined;
      }
      return { direction: move[0], distance: parseInt(move[1]) };
    })
    .filter((move) => move !== undefined)
    .map((move) => move as Move);
};

const calculateFinalPosition = (position: Position): number =>
  position.horizontal * position.depth;

const exercise = (fileName: string): number =>
  compose(calculateFinalPosition, moveSub, readInput)(fileName);

test('example', () => {
  const movements: Move[] = [
    { direction: 'forward', distance: 5 },
    { direction: 'down', distance: 5 },
    { direction: 'forward', distance: 8 },
    { direction: 'up', distance: 3 },
    { direction: 'down', distance: 8 },
    { direction: 'forward', distance: 2 },
  ];
  const position = moveSub(movements);
  expect(calculateFinalPosition(position)).toEqual(150);
});

test('sampleFile', () => {
  expect(exercise('sample.txt')).toEqual(150);
});

test('exercise', () => {
  expect(exercise('subMovements.txt')).toEqual(1698735);
});
