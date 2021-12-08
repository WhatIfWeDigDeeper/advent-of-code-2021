import * as fs from 'fs';
import { compose } from 'lodash/fp';
import * as path from 'path';

type BingoPosition = {
  value: number;
  marked: boolean;
};

type BingoCardRow = BingoPosition[];

type BingoCard = BingoCardRow[];

type WinningCard = {
  card: BingoCard;
  cardId: number;
  winningNumber: number;
};

type GameData = {
  drawings: number[];
  bingoCards: BingoCard[];
};

const parseBingoCardRow = (row: string): BingoCardRow =>
  row
    .trim()
    .split(' ')
    .filter((maybeSpace) => maybeSpace.length > 0)
    .map(Number)
    .map(
      (value: number) => ({ value, marked: false } as BingoPosition)
    ) as BingoCardRow;

function parseFile(fileName: string): GameData {
  const filePath = path.join(__dirname, fileName);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const drawings = lines[0].split(',').map(Number);
  const bingoData: { bingoCards: BingoCard[]; currentCard: BingoCardRow[] } =
    lines.slice(2).reduce(
      (
        acc: { bingoCards: BingoCard[]; currentCard: BingoCardRow[] },
        line: string
      ) => {
        if (line.trim().length === 0) {
          if (acc.currentCard.length > 0) {
            acc.bingoCards.push(acc.currentCard);
            acc.currentCard = [];
          }
          return acc;
        }
        acc.currentCard.push(parseBingoCardRow(line));
        return acc;
      },
      { bingoCards: [], currentCard: [] }
    );
  return { drawings, bingoCards: bingoData.bingoCards };
}

const isBingo = (line: BingoPosition[]): boolean =>
  line.every((position) => position.marked);

function checkCard(
  card: BingoCard,
  drawValue: number,
  cardId: number
): WinningCard | null {
  for (let row = 0; row < card.length; row++) {
    for (let column = 0; column < card[row].length; column++) {
      if (card[row][column].value === drawValue) {
        card[row][column].marked = true;
        // check if winner
        if (isBingo(card[row]) || isBingo(card.map((row) => row[column]))) {
          return {
            card,
            cardId,
            winningNumber: drawValue,
          };
        }
        return null;
      }
    }
  }
  return null;
}

function generateBingoCard(size: number): BingoCard {
  const bingoCard: BingoCard = [];
  for (let row = 0; row < size; row++) {
    bingoCard.push([]);
    for (let column = 0; column < size; column++) {
      bingoCard[row].push({ value: row * size + column + 1, marked: false });
    }
  }
  return bingoCard;
}

const sumUnmarkedRow = (row: BingoCardRow): number =>
  row.reduce(
    (acc, position) => (position.marked ? acc : acc + position.value),
    0
  );

function sumUnmarkedCard(card: BingoCard): number {
  return card.reduce((acc, row) => {
    return acc + sumUnmarkedRow(row);
  }, 0);
}

function calculateFinalScore(winner: WinningCard): number {
  return sumUnmarkedCard(winner.card) * winner.winningNumber;
}

function drawUntilWinner(gameData: GameData): WinningCard {
  let winner: WinningCard | null = null;
  for (const drawing of gameData.drawings) {
    for (let i = 0; i < gameData.bingoCards.length; i++) {
      winner = checkCard(gameData.bingoCards[i], drawing, i + 1);
      if (winner) {
        return winner;
      }
    }
  }
  throw new Error('No winner found');
}

export const playBingo = compose(
  calculateFinalScore,
  drawUntilWinner,
  parseFile
);

test('checkCard horizontal', () => {
  const card = generateBingoCard(3);
  let winningCard: WinningCard | null = null;

  winningCard = checkCard(card, 1, 1);
  expect(card[0][0].marked).toBe(true);
  expect(winningCard).toBe(null);

  winningCard = checkCard(card, 2, 1);
  expect(card[0][1].marked).toBe(true);
  expect(winningCard).toBe(null);

  winningCard = checkCard(card, 3, 1);
  expect(card[0][2].marked).toBe(true);
  expect(winningCard).not.toEqual(null);
});

test('checkCard vertical', () => {
  const card = generateBingoCard(3);
  let winningCard: WinningCard | null = null;

  winningCard = checkCard(card, 1, 1);
  expect(card[0][0].marked).toBe(true);
  expect(winningCard).toBe(null);

  winningCard = checkCard(card, 4, 1);
  expect(card[1][0].marked).toBe(true);
  expect(winningCard).toBe(null);

  winningCard = checkCard(card, 7, 1);
  expect(card[2][0].marked).toBe(true);
  expect(winningCard).not.toEqual(null);
});

test('checkCard horizontal win', () => {
  const card: BingoCard = [
    [
      { value: 1, marked: false },
      { value: 2, marked: false },
      { value: 3, marked: false },
    ],
    [
      { value: 4, marked: false },
      { value: 5, marked: false },
      { value: 6, marked: false },
    ],
    // winning row
    [
      { value: 7, marked: true },
      { value: 8, marked: false },
      { value: 9, marked: true },
    ],
  ];
  const winningCard = checkCard(card, 8, 1);
  expect(card[2][1].marked).toBe(true);
  expect(winningCard).not.toBeNull();
});

test('sumUnmarkedRow', () => {
  const row = [
    {
      value: 1,
      marked: true,
    },
    { value: 2, marked: false },
    { value: 3, marked: false },
  ];
  expect(sumUnmarkedRow(row)).toBe(5);
});

test('sumUnmarkedCard', () => {
  const card: BingoCard = [
    [
      { value: 1, marked: false },
      { value: 2, marked: false },
      { value: 3, marked: false },
    ],
    [
      { value: 4, marked: false },
      { value: 5, marked: false },
      { value: 6, marked: false },
    ],
    // winning row
    [
      { value: 7, marked: true },
      { value: 8, marked: true },
      { value: 9, marked: true },
    ],
  ];
  const result = sumUnmarkedCard(card);
  expect(result).toBe(21);
});

test('drawUntilWinner', () => {
  const gameData = {
    drawings: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ],
    bingoCards: [generateBingoCard(5)],
  };
  const winner = drawUntilWinner(gameData);
  expect(winner.cardId).toBe(1);
  expect(winner.winningNumber).toBe(5);
  expect(winner.card).not.toBe(null);

  const sumOfUnmarkedBoard = sumUnmarkedCard(winner.card);
  expect(sumOfUnmarkedBoard).toBe(310);
});

test('read sample boards', () => {
  const gameData = parseFile('sample.txt');
  expect(gameData.drawings).toEqual([
    7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18,
    20, 8, 19, 3, 26, 1,
  ]);
  expect(gameData.bingoCards.length).toEqual(3);
  expect(gameData.bingoCards[0].length).toEqual(5);
  expect(gameData.bingoCards[0][0].length).toEqual(5);
});
