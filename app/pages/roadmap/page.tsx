import { Metadata } from 'next'
import { Footer } from '@/components/ui/layout/footer'
import { Timeline } from '@/components/ui/timeline'

export const metadata: Metadata = {
  title: 'BARK Token Roadmap',
  description: 'Explore the future plans and milestones for the BARK Token project on Solana.',
}

const roadmapItems = [
  {
    date: 'Q2 2024',
    title: 'Token Launch',
    description: 'Official launch of BARK Token on the Solana blockchain with initial distribution to early supporters.',
  },
  {
    date: 'Q3 2024',
    title: 'Community Governance',
    description: 'Implementation of decentralized governance mechanisms allowing BARK holders to participate in decision-making.',
  },
  {
    date: 'Q2-Q3 2025',
    title: 'DeFi Integration',
    description: 'Integration with major Solana DeFi protocols to increase utility and liquidity for BARK Token.',
  },
  {
    date: 'Q4 2025',
    title: 'Cross-Chain Bridge',
    description: 'Development of cross-chain bridges to enable BARK Token interoperability with other major blockchains.',
  },
  {
    date: 'Q1-Q2 2026',
    title: 'Ecosystem Expansion',
    description: 'Partnerships and integrations to expand the BARK Token ecosystem and use cases.',
  },
  {
    date: 'Q2-Q3 2026',
    title: 'Mobile App Launch',
    description: 'Release of the BARK Protocol mobile app for swap, payments, donation, easy token management and community engagement.',
  },
]

export default function RoadmapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">BARK Token Roadmap</h1>
        <p className="text-xl text-center mb-12 max-w-2xl mx-auto">
          Our journey to revolutionize the Solana ecosystem. Explore the key milestones and future plans for BARK Token.
        </p>
        <Timeline items={roadmapItems} />
      </main>
      <Footer />
    </div>
  )
}
