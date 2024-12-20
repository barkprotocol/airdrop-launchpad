import { Metadata } from 'next';
import { Footer } from '@/components/ui/layout/footer';

export const metadata: Metadata = {
  title: 'About BARK Token Airdrop',
  description: 'Learn all you need to know about the BARK Token ($BARK) Airdrop',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">All You Need to Know About the BARK Token ($BARK) Airdrop</h1>
        <div className="space-y-6">
          {/* Section: What is BARK Token? */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">What is BARK Token?</h2>
            <p>
              BARK Token ($BARK) is a new cryptocurrency designed to revolutionize the Solana ecosystem. It aims to empower community-driven initiatives and reward loyal supporters.
            </p>
          </section>

          {/* Section: About the Airdrop */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">About the Airdrop</h2>
            <p>
              The BARK Token Airdrop is an initiative to distribute tokens to early supporters and active community members. This airdrop is designed to reward those who have contributed to the growth and development of the BARK ecosystem.
            </p>
          </section>

          {/* Section: Eligibility Criteria */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Eligibility Criteria</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Holding a minimum amount of BARK tokens</li>
              <li>Participating in community events and discussions</li>
              <li>Contributing to the BARK ecosystem development</li>
              <li>Early adopters and supporters of BARK-related projects</li>
            </ul>
          </section>

          {/* Section: How to Claim */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">How to Claim</h2>
            <p>
              To claim your BARK tokens, use the eligibility checker on our homepage. If you're eligible, you'll be guided through the claiming process. Make sure you have a compatible Solana wallet to receive your tokens.
            </p>
          </section>

          {/* Section: Token Utility */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Token Utility</h2>
            <p>
              BARK tokens can be used for various purposes within the ecosystem, including governance voting, staking for rewards, and accessing exclusive features in BARK-powered applications.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
