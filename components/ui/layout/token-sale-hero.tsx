'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VerifyEligibility } from './verify-eligibility-iwo';

const BACKGROUND_URL = "https://ucarecdn.com/f6029e68-9768-49db-80a9-64e41e70acff/waveblack.png";

type SaleType = 'airdrop' | 'iwo';

interface SaleContent {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}

const saleContent: Record<SaleType, SaleContent> = {
  airdrop: {
    title: "$BARK Airdrop Eligibility Check",
    subtitle: "Airdrop Checker",
    description: "Discover if you're part of the BARK revolution! Check your eligibility for the exclusive $BARK airdrop, rewarding our loyal on-chain supporters.",
    buttonText: "Check Airdrop Eligibility"
  },
  iwo: {
    title: "$BARK Initial Wallet Offering",
    subtitle: "IWO Participation",
    description: "Be part of the BARK ecosystem from the start! Check your eligibility to participate in our Initial Wallet Offering and secure your $BARK tokens early.",
    buttonText: "Check IWO Eligibility"
  }
};

export function TokenSaleHero() {
  const [selectedSale, setSelectedSale] = useState<SaleType>('airdrop');

  const content = saleContent[selectedSale];

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
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={selectedSale === 'airdrop' ? 'default' : 'outline'}
            onClick={() => setSelectedSale('airdrop')}
          >
            Airdrop
          </Button>
          <Button
            variant={selectedSale === 'iwo' ? 'default' : 'outline'}
            onClick={() => setSelectedSale('iwo')}
          >
            IWO
          </Button>
        </div>
        <div className="mb-8 flex justify-center">
          <span className="inline-block bg-gradient-to-r from-[#D0C8B9] to-[#E5DFD3] text-gray-900 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-full uppercase tracking-wide shadow-lg shadow-[#D0C8B9]/20 relative">
            <span className="relative z-10">{content.subtitle}</span>
            <span className="absolute inset-0 bg-[#D0C8B9] opacity-50 blur-md rounded-full"></span>
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9), 0_8px_6px_rgba(0,0,0,0.7)]">
          {content.title}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
          {content.description}
        </p>
        <VerifyEligibility saleType={selectedSale} />
      </div>
    </div>
  );
}

