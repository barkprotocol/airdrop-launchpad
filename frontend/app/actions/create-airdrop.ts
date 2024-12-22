'use server'

import { 
  createAirdropWallet, 
  createTransaction, 
  getUserByWalletAddress, 
  createUser, 
  createAirdrop, 
  getAirdropWalletBalance, 
  updateAirdropWalletBalance, 
  getAirdropWallet 
} from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateAirdropFormData } from '@/app/types/airdrop'

export async function createNewAirdrop(data: CreateAirdropFormData) {
  try {
    const { recipientAddress, amount, category, description } = data
    const amountBigInt = BigInt(amount)

    // Get or create user
    let user = await getUserByWalletAddress(recipientAddress)
    if (!user) {
      user = await createUser(recipientAddress)
    }

    // Get or create airdrop wallet if it doesn't exist
    let airdropWallet = await getAirdropWallet()
    if (!airdropWallet) {
      const airdropWalletAddress = process.env.NEXT_PUBLIC_AIRDROP_WALLET_ADDRESS
      const initialBalance = process.env.INITIAL_AIRDROP_BALANCE

      if (!airdropWalletAddress || !initialBalance) {
        throw new Error('Airdrop wallet address or initial balance not configured')
      }

      airdropWallet = await createAirdropWallet(
        airdropWalletAddress,
        BigInt(initialBalance)
      )
    }

    // Check if there's enough balance
    const { availableBalance } = await getAirdropWalletBalance()
    if (availableBalance < amountBigInt) {
      return {
        success: false,
        message: 'Insufficient funds in airdrop wallet'
      }
    }

    // Create airdrop
    const airdrop = await createAirdrop(user.id, amountBigInt, 'pending', category, description)

    // Create transaction record
    const transaction = await createTransaction(
      airdropWallet.id,
      amountBigInt,
      recipientAddress,
      'pending'
    )

    // Update airdrop wallet balance
    await updateAirdropWalletBalance(
      airdropWallet.id,
      airdropWallet.balance,
      airdropWallet.usedBalance + amountBigInt
    )

    revalidatePath('/admin/airdrops')
    
    return {
      success: true,
      message: 'Airdrop created successfully',
      data: {
        id: airdrop.id,
        amount: amount.toString(),
        recipientAddress,
        transactionId: transaction.id
      }
    }
  } catch (error) {
    console.error('Error creating airdrop:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create airdrop'
    }
  }
}

