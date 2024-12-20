"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { isValidSolanaAddress } from '@/lib/utils';

export function VerifyEligibility() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleEligibilityCheck = async () => {
    if (!isValidSolanaAddress(walletAddress)) {
      toast.error('Please enter or paste a valid Solana wallet address.');
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('/api/eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isEligible) {
          toast.success('Congratulations! You are eligible for the $BARK airdrop.');
        } else {
          toast('You are not currently eligible for the $BARK airdrop. Keep an eye out for future opportunities!', {
            icon: '🔔',
          });
        }
      } else {
        toast.error(data.error || 'Failed to check eligibility. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while checking eligibility. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-md rounded-lg p-6 mb-8 border border-white border-opacity-20">
      <h2 className="text-2xl font-semibold mb-4 text-white text-center">Verify Your Eligibility</h2>
      <p className="text-gray-300 mb-4 text-center">
        Enter your Solana wallet address below to see if you qualify for the $BARK airdrop. Eligible wallets include active BARK holders and early supporters.
      </p>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Solana wallet address (e.g., BARKxxxxx...)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="bg-white bg-opacity-10 text-white placeholder-gray-400 border-white border-opacity-20"
        />
        <Button
          onClick={handleEligibilityCheck}
          disabled={isChecking}
          className="bg-[#D0C8B9] hover:bg-[#BEB6A7] text-gray-900 font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          {isChecking ? 'Checking...' : 'Check Eligibility'}
        </Button>
      </div>
    </div>
  );
}

