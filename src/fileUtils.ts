import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export const readAllLines = (fileName: string): string[] =>
  fs
    .readFileSync(path.join(__dirname, fileName), 'utf-8')
    .split('\n')
    .filter((line) => line.length > 0);

export interface LineProcessor {
  <T>(line: string): T;
}

export async function processLineByLine<T>(
  filePath: string,
  lineProcessor: LineProcessor
): Promise<T[]> {
  let result: T[] = [];
  const fileStream = fs.createReadStream(filePath);

  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of lineReader) {
    const processedLine: T = lineProcessor(line);
    if (processedLine !== undefined) {
      result = result.concat([processedLine]);
    }
  }
  return result;
}
