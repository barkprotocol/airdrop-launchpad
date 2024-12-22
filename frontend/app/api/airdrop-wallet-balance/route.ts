import { NextApiRequest, NextApiResponse } from 'next'
import { getAirdropWalletBalance } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const walletBalance = await getAirdropWalletBalance()
    res.status(200).json(walletBalance)
  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    res.status(500).json({ error: 'Failed to fetch wallet balance' })
  }
}
