'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const BACKGROUND_URL = "https://ucarecdn.com/f6029e68-9768-49db-80a9-64e41e70acff/waveblack.png";

export function InitialWalletOfferingHero() {
  const [address, setAddress] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration purposes, we'll just show a success message
      toast.success('You are eligible to participate in the IWO!');
    } catch (error) {
      console.error('Error checking IWO eligibility:', error);
      toast.error('An error occurred while checking eligibility. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={BACKGROUND_URL}
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={85}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      <div className="relative z-10 text-white text-center px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <span className="inline-block bg-gradient-to-r from-[#D0C8B9] to-[#E5DFD3] text-gray-900 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-full uppercase tracking-wide shadow-lg shadow-[#D0C8B9]/20 relative">
            <span className="relative z-10">Initial Wallet Offering</span>
            <span className="absolute inset-0 bg-[#D0C8B9] opacity-50 blur-md rounded-full"></span>
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9), 0_8px_6px_rgba(0,0,0,0.7)]">
          $BARK Initial Wallet Offering
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
          Be part of the BARK ecosystem from the start! Check your eligibility to participate in our Initial Wallet Offering and secure your $BARK tokens early.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <Input
            type="text"
            placeholder="Enter your wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300 border-white border-opacity-30"
          />
          <Button 
            type="submit" 
            disabled={isChecking}
            className="w-full bg-gradient-to-r from-[#D0C8B9] to-[#E5DFD3] text-gray-900 hover:from-[#E5DFD3] hover:to-[#D0C8B9] relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-gradient-to-r from-[#c0b8a9] to-[#b0a899] group-hover:translate-x-0 group-hover:scale-102"></span>
            <span className="relative">
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Checking...
                </>
              ) : (
                'Check IWO Eligibility'
              )}
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
}

