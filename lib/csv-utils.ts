import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function readWhitelistFromCSV(): string[] {
  const csvFilePath = path.join(process.cwd(), 'whitelist.csv');
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records.map((record: { wallet_address: string }) => record.wallet_address);
}