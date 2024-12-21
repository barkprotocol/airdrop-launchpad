import { Metadata } from 'next'
import { Navbar } from '@/components/ui/layout/navbar'
import { Footer } from '@/components/ui/layout/footer'
import { APIEndpointComponent } from '@/components/api/api-endpoints'
import { endpoints } from '@/app/api/endpoints'
import { Key } from 'react'

export const metadata: Metadata = {
  title: 'BARK Token Airdrop - API Documentation',
  description: 'API documentation for the BARK Token Airdrop system on Solana',
}

export default function APIDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">BARK Airdrop Platform - API Documentation</h1>
        <p className="text-xl mb-8">
          This documentation provides details on how to interact with the BARK Airdrop system programmatically.
          All endpoints require authentication using a JWT token, which can be obtained by logging in through the web interface.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <p className="mb-8">
          To authenticate API requests, include the JWT token in the Authorization header:
          <br />
          <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            Authorization: Bearer YOUR_JWT_TOKEN
          </code>
        </p>
        <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
        <div className="space-y-8">
          {endpoints.map((endpoint: unknown, index: Key | null | undefined) => (
            <APIEndpointComponent key={index} endpoint={endpoint} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

