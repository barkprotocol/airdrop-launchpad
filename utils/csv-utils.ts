import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function readWhitelistFromCSV(): Promise<string[]> {
  try {
    // Define the path to the CSV file
    const csvFilePath = path.join(process.cwd(), 'whitelist.csv');

    // Check if the file exists before reading
    if (!fs.existsSync(csvFilePath)) {
      throw new Error('Whitelist CSV file not found');
    }

    // Read the CSV file asynchronously
    const fileContent = await fs.promises.readFile(csvFilePath, 'utf-8');

    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true,       // Use the first row as column names
      skip_empty_lines: true, // Skip empty lines
    });

    // Check if the wallet_address column exists and is valid
    if (!records.length || !records[0].wallet_address) {
      throw new Error('Invalid CSV format: missing wallet_address column');
    }

    // Extract and return the wallet addresses
    return records.map((record: { wallet_address: string }) => record.wallet_address);
  } catch (error) {
    console.error('Error reading or parsing the CSV file:', error);
    throw new Error('Failed to read the whitelist CSV file');
  }
}
