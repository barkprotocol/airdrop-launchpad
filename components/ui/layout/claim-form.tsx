"use client";

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { EligibilityResponse, ClaimResponseData } from '@/utils/types';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useClaimBARKTokens } from '@/hooks/use-claim-bark-tokens';
import { Button } from '@/components/ui/button';

export function ClaimForm() {
  const { publicKey } = useWallet();
  const { claimTokens, isLoading: isClaimLoading } = useClaimBARKTokens();
  const [eligibilityData, setEligibilityData] = useState<EligibilityResponse | null>(null);
  const [claimData, setClaimData] = useState<ClaimResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEligibilityLoading, setIsEligibilityLoading] = useState(false);

  const handleEligibilityCheck = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsEligibilityLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: publicKey.toBase58() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch eligibility data');
      }

      setEligibilityData(data.eligibility);
      toast.success('Eligibility check completed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to check eligibility');
    } finally {
      setIsEligibilityLoading(false);
    }
  };

  const handleClaim = async () => {
    setError(null);
    try {
      const txSignature = await claimTokens();
      if (txSignature) {
        setClaimData({
          txId: txSignature,
          message: 'BARK tokens claimed successfully',
          amount: eligibilityData?.totalUnclaimed || 0,
          operationalFee: 0, // Add actual fee if available
          communityFee: 0, // Add actual fee if available
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center w-full max-w-md px-4">
      <Button
        onClick={handleEligibilityCheck}
        disabled={!publicKey || isEligibilityLoading}
        className="w-full mb-4"
      >
        {isEligibilityLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          'Check Eligibility'
        )}
      </Button>

      {eligibilityData && eligibilityData.totalUnclaimed > 0 && (
        <Button
          onClick={handleClaim}
          disabled={isClaimLoading}
          className="w-full mb-4"
          variant="default"
        >
          {isClaimLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            'Claim BARK Tokens'
          )}
        </Button>
      )}

      {error && (
        <div className="mt-4 bg-red-100 p-6 rounded-lg w-full flex items-center">
          <XCircle className="mr-2 text-red-500" size={24} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {eligibilityData && (
        <div className="mt-4 bg-gray-100 p-6 rounded-lg w-full">
          <h3 className="text-xl font-bold mb-4">Eligibility Data:</h3>
          <p className="mb-2">Total Unclaimed: {eligibilityData.totalUnclaimed}</p>
          <p className="mb-4">Total: {eligibilityData.total}</p>
          <h4 className="text-lg font-bold mb-2">Categories:</h4>
          {eligibilityData.categories.map((category, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-md shadow-sm">
              <p className="font-semibold">{category.category}</p>
              <p>Total: {category.total}</p>
              <p>Items: {category.items.length}</p>
            </div>
          ))}
        </div>
      )}

      {claimData && (
        <div className="mt-4 bg-green-100 p-6 rounded-lg w-full">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <CheckCircle className="mr-2 text-green-500" size={24} />
            Claim Successful!
          </h3>
          <p className="mb-2">Transaction ID: {claimData.txId}</p>
          <p className="mb-2">Amount Claimed: {claimData.amount} BARK</p>
          <p className="mb-2">Operational Fee: {claimData.operationalFee} BARK</p>
          <p className="mb-2">Community Fee: {claimData.communityFee} BARK</p>
          <p>{claimData.message}</p>
        </div>
      )}
    </div>
  );
}