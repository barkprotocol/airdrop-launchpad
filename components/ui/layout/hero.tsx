"use client";

import Image from 'next/image';
import { VerifyEligibility } from '@/components/ui/layout/verify-eligibility';

const BACKGROUND_URL = "https://ucarecdn.com/f6029e68-9768-49db-80a9-64e41e70acff/waveblack.png";

export function Hero() {
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
      <div className="relative z-10 text-white text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="inline-block bg-gradient-to-r from-[#D0C8B9] to-[#E5DFD3] text-gray-900 text-sm font-semibold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg shadow-[#D0C8B9]/20 relative">
            <span className="relative z-10">Airdrop Checker</span>
            <span className="absolute inset-0 bg-[#D0C8B9] opacity-50 blur-md rounded-full"></span>
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          $BARK Airdrop Eligibility
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-gray-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
          Discover if you're part of the BARK revolution! Check your eligibility for the exclusive $BARK airdrop, rewarding our loyal on-chain supporters.
        </p>
        <div className="relative">
          <div className="absolute inset-0 bg-[#D0C8B9] opacity-10 blur-xl rounded-3xl"></div>
          <VerifyEligibility />
        </div>
      </div>
    </div>
  );
}

