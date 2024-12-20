import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { Discord, Telegram, X } from '@/components/ui/icons/social-media-icons';

export function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Image
              src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
              alt="BARK Logo"
              width={40}
              height={40}
            />
            <p className="text-gray-400 text-sm">
              Empowering the Solana ecosystem through community-driven initiatives.
            </p>
            <div className="flex space-x-6">
              <a href="https://x.com/bark_protocol" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">X (Twitter)</span>
                <X className="h-6 w-6" />
              </a>
              <a href="https://github.com/bark-protocol" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="https://discord.gg/bark-protocol" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Discord</span>
                <Discord className="h-6 w-6" />
              </a>
              <a href="https://t.me/bark_protocol" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Telegram</span>
                <Telegram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">BARK</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-400 hover:text-gray-300">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/tokenomics" className="text-base text-gray-400 hover:text-gray-300">
                      Tokenomics
                    </Link>
                  </li>
                  <li>
                    <Link href="/roadmap" className="text-base text-gray-400 hover:text-gray-300">
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/faq" className="text-base text-gray-400 hover:text-gray-300">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <a href="https://docs.barkprotocol.com" className="text-base text-gray-400 hover:text-gray-300">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <Link href="/disclaimer" className="text-base text-gray-400 hover:text-gray-300">
                      Legal Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2024 BARK Protocol. All rights reserved.
          </p>
          <div className="mt-4 text-sm text-gray-400 xl:text-center">
            Contract Address: 
            <a 
              href="https://solscan.io/token/2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-gray-300 hover:text-gray-100"
            >
              2NTv....AkVrg
              <ExternalLink className="inline-block ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

