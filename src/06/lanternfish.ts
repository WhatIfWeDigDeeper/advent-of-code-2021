import { readAllLines } from '../fileUtils';

function parseFile(fileName: string): number[] {
  return readAllLines(fileName)[0].split(',').map(Number);
}

export function calculateLanternfishCount(
  fileName: string,
  days: number
): number {
  const data = parseFile(`06/${fileName}`);
  for (let day = 1; day <= days; day++) {
    const babyFish: number[] = [];
    for (let fish = 0; fish < data.length; fish++) {
      if (data[fish] === 0) {
        data[fish] = 6;
        babyFish.push(8);
      } else {
        data[fish] = data[fish] - 1;
      }
    }
    data.push(...babyFish);
  }
  return data.length;
}
