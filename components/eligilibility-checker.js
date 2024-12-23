import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';

async function checkEligibility(address) {
  try {
    const fileContent = await fs.readFile('eligibility.csv', 'utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });
    
    const eligibleRecord = records.find(record => record.address.toLowerCase() === address.toLowerCase());
    
    if (eligibleRecord) {
      return {
        isEligible: true,
        amount: parseFloat(eligibleRecord.amount)
      };
    } else {
      return { isEligible: false };
    }
  } catch (error) {
    console.error('Error reading or parsing CSV:', error);
    throw new Error('Failed to check eligibility');
  }
}

// Example usage
const testAddress = '9ZNTfG4NyQgxy2SWjSiQoUyBPEvXT2xo7fKc5hPYYJ7b';
checkEligibility(testAddress).then(result => console.log(result));