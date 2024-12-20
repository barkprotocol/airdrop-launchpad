import { 
    getUserByWalletAddress, 
    getEligibility, 
    createClaim, 
    updateAirdropStatus, 
    isWhitelisted,
    getAirdropWallet,
    updateAirdropWalletBalance,
    createTransaction,
    updateClaimStatus,
    updateEligibility
  } from './db'
  import { PublicKey } from '@solana/web3.js'
  import { transferBArkTokens } from './token-transfer'
  
  export async function claim(walletAddress: string, signature: string): Promise<{ success: boolean; message: string; txSignature?: string }> {
    try {
      // Verify the wallet address
      if (!PublicKey.isOnCurve(walletAddress)) {
        return { success: false, message: 'Invalid wallet address' }
      }
  
      // Get user and check eligibility
      const user = await getUserByWalletAddress(walletAddress)
      if (!user) {
        return { success: false, message: 'User not found' }
      }
  
      const eligibility = await getEligibility(user.id)
      if (!eligibility || eligibility.unclaimedAmount <= BigInt(0)) {
        return { success: false, message: 'Not eligible for claim' }
      }
  
      // Check whitelist (optional)
      const whitelisted = await isWhitelisted(walletAddress)
      if (!whitelisted) {
        console.log('Wallet is not whitelisted, but proceeding with claim as whitelist is optional')
      }
  
      // Verify signature (simplified for this example)
      if (!signature) {
        return { success: false, message: 'Invalid signature' }
      }
  
      // Process the claim
      const airdropWallet = await getAirdropWallet()
      if (!airdropWallet) {
        return { success: false, message: 'Airdrop wallet not found' }
      }
  
      if (airdropWallet.balance < eligibility.unclaimedAmount) {
        return { success: false, message: 'Insufficient funds in airdrop wallet' }
      }
  
      const claim = await createClaim(user.id, eligibility.unclaimedAmount, 'processing')
  
      // Trigger the actual token transfer
      const transferResult = await transferBArkTokens(airdropWallet.walletAddress, walletAddress, BigInt(eligibility.unclaimedAmount))
      
      if (!transferResult.success) {
        await updateClaimStatus(claim.id, 'failed')
        return { success: false, message: transferResult.message }
      }
  
      // Update airdrop wallet balance
      const newBalance = BigInt(airdropWallet.balance) - BigInt(eligibility.unclaimedAmount)
      const newUsedBalance = BigInt(airdropWallet.usedBalance) + BigInt(eligibility.unclaimedAmount)
      await updateAirdropWalletBalance(airdropWallet.id, newBalance, newUsedBalance)
  
      // Create transaction record
      await createTransaction(
        airdropWallet.id,
        eligibility.unclaimedAmount,
        walletAddress,
        'completed',
        transferResult.txSignature
      )
  
      // Update claim status
      await updateClaimStatus(claim.id, 'completed', transferResult.txSignature)
  
      // Update airdrop status
      const airdrop = user.airdrops[0] // Assuming one airdrop per user
      if (airdrop) {
        await updateAirdropStatus(airdrop.id, 'claimed', new Date())
      } else {
        console.warn('No airdrop found for user, but claim was processed')
      }
  
      // Update eligibility
      const updatedUnclaimedAmount = BigInt(eligibility.unclaimedAmount) - BigInt(claim.amount)
      await updateEligibility(eligibility.id, eligibility.totalAmount, updatedUnclaimedAmount)
  
      return { success: true, message: 'Airdrop claimed successfully', txSignature: transferResult.txSignature }
    } catch (error) {
      console.error('Error processing claim:', error)
      return { success: false, message: 'Error processing claim' }
    }
  }
  
  