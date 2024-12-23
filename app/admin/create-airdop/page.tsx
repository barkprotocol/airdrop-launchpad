import { Metadata } from 'next'
import { CreateAirdropForm } from '@/components/admin/create-airdrop-form'
import { AirdropWalletBalance } from '@/components/admin/airdrop-wallet-balance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Create Airdrop - BARK Admin',
  description: 'Create a new BARK token airdrop',
}

export default function CreateAirdropPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6">
        <AirdropWalletBalance />
        <Card>
          <CardHeader>
            <CardTitle>Create Airdrop</CardTitle>
            <CardDescription>
              Create a new BARK token airdrop for eligible recipients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateAirdropForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

