import { compose } from 'lodash/fp';
import { readAllLines } from '../fileUtils';

type Point = {
  x: number;
  y: number;
};

type Line = {
  start: Point;
  end: Point;
};

type Grid = number[][];

function findMaxPoint(lines: Line[]): Point {
  return lines.reduce(
    (acc: Point, line: Line): Point => {
      acc.x = Math.max(acc.x, line.start.x, line.end.x);
      acc.y = Math.max(acc.y, line.start.y, line.end.y);
      return acc;
    },
    { x: 0, y: 0 }
  );
}

function generateGrid(maxPoint: Point): Grid {
  const grid: number[][] = [];
  for (let y = 0; y <= maxPoint.y; y++) {
    grid[y] = new Array(maxPoint.x + 1).fill(0);
  }
  return grid;
}

const markGrid =
  (includeDiagonals = false) =>
  (grid: Grid, lines: Line[]): Grid => {
    lines.forEach((line) => {
      if (line.start.x === line.end.x) {
        const startY = Math.min(line.start.y, line.end.y);
        const endY = Math.max(line.start.y, line.end.y);
        for (let y = startY; y <= endY; y++) {
          grid[y][line.start.x] += 1;
        }
      } else if (line.start.y === line.end.y) {
        const startX = Math.min(line.start.x, line.end.x);
        const endX = Math.max(line.start.x, line.end.x);
        for (let x = startX; x <= endX; x++) {
          grid[line.start.y][x] += 1;
        }
      } else if (includeDiagonals) {
        for (
          let x = line.start.x, y = line.start.y;
          x !== line.end.x && y !== line.end.y;
          line.start.x <= line.end.x ? x++ : x--,
            line.start.y <= line.end.y ? y++ : y--
        ) {
          grid[y][x] += 1;
        }
      }
    });
    return grid;
  };

function countDangerousVents(grid: Grid, dangerousCount = 2): number {
  return grid.reduce(
    (acc, row) => acc + row.filter((value) => value >= dangerousCount).length,
    0
  );
}

const mapVents =
  (includeDiagonals = false) =>
  (lines: Line[]): Grid => {
    const maxPoint = findMaxPoint(lines);
    const grid = generateGrid(maxPoint);
    const gridWithVents = markGrid(includeDiagonals)(grid, lines);
    return gridWithVents;
  };

function parseLine(line: string): Line {
  const [startX, startY, endX, endY] = line
    .trim()
    .split(' -> ')
    .flatMap((pair) => pair.split(','))
    .map(Number);
  return { start: { x: startX, y: startY }, end: { x: endX, y: endY } };
}

const parseLines = (input: string[]): Line[] => input.map(parseLine);

// export const calculateDangerousCoordinates: (input: string[], includeDiagonals = false) => number =
//   compose(countDangerousVents, mapVents(includeDiagonals), parseLines);

export const calculateDangerousVentCount = (
  fileName: string,
  includeDiagonals = false
): number =>
  compose(
    countDangerousVents,
    mapVents(includeDiagonals),
    parseLines,
    readAllLines
  )(fileName);

test('unit tests', () => {
  const lineData = [
    '0,9 -> 5,9',
    '8,0 -> 0,8', // diagonal
    '9,4 -> 3,4',
    '0,9 -> 2,9',
    '2,9 -> 6,9', // produce 3 at point (2,9)
  ];
  const lines = lineData.map(parseLine);

  expect(lines.length).toBe(5);

  const maxPoint = findMaxPoint(lines);
  expect(maxPoint).toEqual({ x: 9, y: 9 });

  const grid = generateGrid(maxPoint);
  expect(grid[0].length).toBe(10);

  const markedGrid = markGrid(false)(grid, lines);
  expect(markedGrid[0][0]).toBe(0);
  expect(markedGrid[4][4]).toBe(1);
  expect(markedGrid[9][0]).toBe(2);
  expect(markedGrid[9][2]).toBe(3);

  const dangerCount = countDangerousVents(markedGrid);
  expect(dangerCount).toBe(6);
});
