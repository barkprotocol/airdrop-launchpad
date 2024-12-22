import { sendTokens } from '@/components/services/send-tokens-function';

const destinationWallet = 'recipient_wallet_address_here';
const amountToSend = BigInt(1000); // Adjust this based on token decimals (e.g., 1000 * 10^9 for 9 decimals)

sendTokens(destinationWallet, amountToSend)
  .then((result) => {
    if (result.success) {
      console.log(`Transaction successful! TX Signature: ${result.txSignature}`);
    } else {
      console.error(`Error: ${result.message}`);
    }
  })
  .catch((error) => {
    console.error(`Unexpected error: ${error.message}`);
  });
