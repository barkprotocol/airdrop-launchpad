import fs from 'fs';
import csvParser from 'csv-parser';
import { PublicKey } from '@solana/web3.js';

const BARK_TOKEN_DECIMALS = 9;

export async function readAndValidateCSV(filePath: string): Promise<{ success: boolean; data: { walletAddress: string; amount: bigint }[]; errors: string[] }> {
  const data: { walletAddress: string; amount: bigint }[] = [];
  const errors: string[] = [];

  try {
    const fileStream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(csvParser())
        .on('data', (row) => {
          const walletAddress = row.walletAddress?.trim();
          const amountString = row.amount?.trim();

          if (!walletAddress || !PublicKey.isOnCurve(walletAddress)) {
            errors.push(`Invalid wallet address: ${walletAddress}`);
            return;
          }

          if (!amountString || isNaN(Number(amountString)) || Number(amountString) <= 0) {
            errors.push(`Invalid amount for wallet ${walletAddress}: ${amountString}`);
            return;
          }

          const amount = BigInt(Math.round(Number(amountString) * 10 ** BARK_TOKEN_DECIMALS));
          data.push({ walletAddress, amount });
        })
        .on('end', () => resolve({ success: true, data, errors }))
        .on('error', (error) => reject(error));
    });
  } catch (error) {
    console.error('Error reading CSV:', error);
    return { success: false, data: [], errors: ['Error reading CSV file'] };
  }
}
