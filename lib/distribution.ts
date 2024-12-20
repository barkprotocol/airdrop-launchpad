import { 
  getAirdropWallet, 
  updateAirdropWalletBalance, 
  createTransaction, 
  getUserByWalletAddress, 
  createAirdrop, 
  createEligibility,
  createUser,
  getEligibility,
  updateEligibility
} from './db'
import { PublicKey } from '@solana/web3.js'

export async function distributeAirdrop(
  recipientWalletAddress: string, 
  amount: bigint,
  category: string,
  description?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify the wallet address
    if (!PublicKey.isOnCurve(recipientWalletAddress)) {
      return { success: false, message: 'Invalid wallet address' }
    }

    const airdropWallet = await getAirdropWallet()
    if (!airdropWallet) {
      return { success: false, message: 'Airdrop wallet not found' }
    }

    if (airdropWallet.balance < amount) {
      return { success: false, message: 'Insufficient funds in airdrop wallet' }
    }

    // Get or create user
    let user = await getUserByWalletAddress(recipientWalletAddress)
    if (!user) {
      user = await createUser(recipientWalletAddress)
    }

    // Create airdrop record
    const airdrop = await createAirdrop(user.id, amount, 'pending', category, description)

    // Create or update eligibility
    const eligibility = await getEligibility(user.id)
    if (eligibility) {
      await updateEligibility(eligibility.id, eligibility.totalAmount + amount, eligibility.unclaimedAmount + amount)
    } else {
      await createEligibility(user.id, amount, amount)
    }

    // Update airdrop wallet balance
    const newBalance = airdropWallet.balance - amount
    const newUsedBalance = airdropWallet.usedBalance + amount
    await updateAirdropWalletBalance(airdropWallet.id, newBalance, newUsedBalance)

    // Create transaction record
    await createTransaction(
      airdropWallet.id,
      amount,
      recipientWalletAddress,
      'completed',
      'simulated-distribution-signature'
    )

    return { success: true, message: 'Airdrop distributed successfully' }
  } catch (error) {
    console.error('Error distributing airdrop:', error)
    return { success: false, message: 'Error distributing airdrop' }
  }
}

