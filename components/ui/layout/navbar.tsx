"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/ui/wallet-button';

const LOGO_URL = "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image src={LOGO_URL} alt="BARK Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold text-white font-inter">BARK</span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center flex-1">
            <div className="flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-[#D0C8B9] hover:text-white hover:bg-gray-800 transition duration-150 ease-in-out">
                Home
              </Link>
              <Link href="/pages/about" className="px-3 py-2 rounded-md text-sm font-medium text-[#D0C8B9] hover:text-white hover:bg-gray-800 transition duration-150 ease-in-out">
                About
              </Link>
              <Link href="/pages/faq" className="px-3 py-2 rounded-md text-sm font-medium text-[#D0C8B9] hover:text-white hover:bg-gray-800 transition duration-150 ease-in-out">
                FAQ
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center space-x-2">
            <Button
              as="a"
              href="/buy"
              className="bg-[#D0C8B9] text-gray-900 hover:bg-[#E5DFD3] transition duration-150 ease-in-out px-3 py-1.5 rounded-md text-sm font-medium"
            >
              Buy BARK
            </Button>
            <WalletButton />
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#D0C8B9] hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#D0C8B9]"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-[#D0C8B9] hover:text-white hover:bg-gray-800">
              Home
            </Link>
            <Link href="/pages/about" className="block px-3 py-2 rounded-md text-base font-medium text-[#D0C8B9] hover:text-white hover:bg-gray-800">
              About
            </Link>
            <Link href="/pages/faq" className="block px-3 py-2 rounded-md text-base font-medium text-[#D0C8B9] hover:text-white hover:bg-gray-800">
              FAQ
            </Link>
            <Link href="/buy" className="block px-3 py-2 rounded-md text-base font-medium bg-[#D0C8B9] text-gray-900 hover:bg-[#E5DFD3]">
              Buy BARK
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-4">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

