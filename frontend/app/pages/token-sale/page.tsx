import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

const TokenSalePage = () => {
  const { publicKey, connected } = useWallet();
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const checkSaleStatus = async () => {
    try {
      const response = await axios.get('/api/token-sale/status');
      setStatus(response.data.status);
    } catch (error) {
      setMessage('Failed to fetch token sale status');
    }
  };

  const handlePurchase = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet first');
      return;
    }

    try {
      const response = await axios.post('/api/token-sale/buy', {
        walletAddress: publicKey.toString(),
        amount,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error purchasing tokens');
    }
  };

  return (
    <div>
      <h1>BARK Token Sale</h1>
      {status === 'open' ? (
        <div>
          <p>Token Sale is Live</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount of tokens"
          />
          <button onClick={handlePurchase}>Buy Tokens</button>
        </div>
      ) : (
        <p>Token Sale is Closed</p>
      )}
      <p>{message}</p>
    </div>
  );
};

export default TokenSalePage;
