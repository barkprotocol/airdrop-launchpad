import { useState, useCallback } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      try {
        const { solana } = window as any;
        const response = await solana.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setConnected(true);
      } catch (err) {
        console.error('Failed to connect wallet', err);
      }
    } else {
      console.error('Solana wallet not found');
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      try {
        const { solana } = window as any;
        await solana.disconnect();
        setPublicKey(null);
        setConnected(false);
      } catch (err) {
        console.error('Failed to disconnect wallet', err);
      }
    }
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (!publicKey) return null;

    try {
      const { solana } = window as any;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await solana.signMessage(encodedMessage, 'utf8');
      return Buffer.from(signedMessage.signature).toString('hex');
    } catch (err) {
      console.error('Failed to sign message', err);
      return null;
    }
  }, [publicKey]);

  return { publicKey, connected, connect, disconnect, signMessage };
}