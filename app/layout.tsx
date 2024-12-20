import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google';
import { createClient } from "@supabase/supabase-js";
import "./styles/globals.css";
import Providers from "@/components/providers";
import ToastProvider from "@/components/providers/toast-provider";
import { Navbar } from '@/components/ui/layout/navbar';
import { Footer } from '@/components/ui/layout/footer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BARK Token Airdrop Eligibility",
  description: "Check your eligibility for the exclusive $BARK token airdrop on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!supabase) {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased bg-black text-white flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center">
            <p className="text-red-500 text-xl">
              Error: Missing Supabase configuration. Please check your environment variables.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-black text-white flex flex-col min-h-screen">
        <Providers>
          <ToastProvider>
            <Navbar />
            <main className="flex-grow p-4">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

