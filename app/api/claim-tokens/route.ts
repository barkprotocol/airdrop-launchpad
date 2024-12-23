import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'
import fs from 'fs/promises'
import { parse } from 'csv-parse/sync'

export async function POST(req: Request) {
  try {
    const { address, signature } = await req.json()

    // Verify the signature
    const publicKey = new PublicKey(address)
    const signatureUint8 = new Uint8Array(Buffer.from(signature, 'hex'))
    const messageUint8 = new TextEncoder().encode(`Claim BARK tokens for ${address}`)
    const isValidSignature = nacl.sign.detached.verify(messageUint8, signatureUint8, publicKey.toBytes())

    if (!isValidSignature) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 })
    }

    // Read and parse the CSV file
    const fileContent = await fs.readFile(process.cwd() + '/data/eligibility.csv', 'utf-8')
    const records = parse(fileContent, { columns: true, skip_empty_lines: true })

    // Check eligibility
    const eligibleRecord = records.find((record: any) => record.address.toLowerCase() === address.toLowerCase())

    if (!eligibleRecord) {
      return NextResponse.json({ success: false, message: 'Not eligible for token claim' }, { status: 400 })
    }

    // TODO: Implement actual token transfer logic here
    // For now, we'll simulate a successful claim
    const txSignature = 'simulated_tx_signature_' + Math.random().toString(36).substr(2, 9)

    return NextResponse.json({
      success: true,
      message: `Successfully claimed ${eligibleRecord.amount} BARK tokens`,
      txSignature
    })
  } catch (error) {
    console.error('Error claiming tokens:', error)
    return NextResponse.json({ success: false, message: 'Failed to claim tokens' }, { status: 500 })
  }
}

