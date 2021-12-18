import { playBingo } from './bingo';

test('play sample', () => {
  const winningScore = playBingo('sample.txt');
  expect(winningScore).toEqual(4512);
});

test('play advent game', () => {
  const winningScore = playBingo('input.txt');
  expect(winningScore).toEqual(32844);
});
