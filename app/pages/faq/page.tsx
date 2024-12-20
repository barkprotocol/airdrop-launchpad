import { Metadata } from 'next';
import { Footer } from '@/components/ui/layout/footer';

export const metadata: Metadata = {
  title: 'FAQ - BARK Token Airdrop',
  description: 'Frequently Asked Questions about the BARK Token ($BARK) Airdrop',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">What is the BARK Token Airdrop?</h2>
            <p>The BARK Token Airdrop is a distribution of $BARK tokens to eligible community members and supporters of the BARK ecosystem on the Solana blockchain.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">How do I check my eligibility?</h2>
            <p>You can check your eligibility by using the Airdrop Checker tool on our homepage. Simply enter your Solana wallet address to see if you qualify.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">When is the airdrop taking place?</h2>
            <p>The exact date of the airdrop will be announced soon. Stay tuned to our official channels for the latest updates.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">How many tokens will I receive?</h2>
            <p>The number of tokens you receive depends on various factors, including your level of participation in the BARK ecosystem. Eligible wallets will receive a fair distribution based on their contributions.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">What can I do with BARK tokens?</h2>
            <p>BARK tokens have various utilities within the ecosystem, including governance voting, staking for rewards, and accessing exclusive features in BARK-powered applications.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Is there a deadline to claim my tokens?</h2>
            <p>Yes, there will be a claiming period after the airdrop is announced. Make sure to claim your tokens within this period to avoid missing out.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">How do I stay updated about the airdrop?</h2>
            <p>Follow our official social media channels and join our community Discord server to stay informed about all BARK Token airdrop updates and announcements.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

