import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

<<<<<<< HEAD:frontend/utils/csv-utils.ts
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
=======
export async function readWhitelistFromCSV(
  filePath: string = '@/data/eligibility.csv'
): Promise<string[]> {
  try {
    // Resolve the full path of the CSV file
    const csvFilePath = path.resolve(filePath);

    // Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found at path: ${csvFilePath}`);
    }

    // Read and parse the CSV file
    const fileContent = await fs.promises.readFile(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Validate and extract wallet addresses
>>>>>>> 942a7b7 (updated):utils/csv-utils.ts
    if (!records.length || !records[0].wallet_address) {
      throw new Error('Invalid CSV format: missing wallet_address column');
    }

<<<<<<< HEAD:frontend/utils/csv-utils.ts
    // Extract and return the wallet addresses
    return records.map((record: { wallet_address: string }) => record.wallet_address);
  } catch (error) {
    console.error('Error reading or parsing the CSV file:', error);
    throw new Error('Failed to read the whitelist CSV file');
=======
    const walletAddresses = records.map((record: { wallet_address: string }) => record.wallet_address);

    // Validate wallet address format
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    walletAddresses.forEach((address) => {
      if (!solanaAddressRegex.test(address)) {
        throw new Error(`Invalid wallet address detected: ${address}`);
      }
    });

    return walletAddresses;
  } catch (error) {
    console.error('Error processing the whitelist CSV:', error.message);
    throw new Error('Failed to read or validate the whitelist CSV file');
>>>>>>> 942a7b7 (updated):utils/csv-utils.ts
  }
}
