import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import { parse } from 'csv-parse/sync'

export async function POST(req: Request) {
  try {
    const { address } = await req.json()

    const fileContent = await fs.readFile(process.cwd() + '/data/eligibility.csv', 'utf-8')
    const records = parse(fileContent, { columns: true, skip_empty_lines: true })

    const eligibleRecord = records.find((record: any) => record.address.toLowerCase() === address.toLowerCase())

    if (eligibleRecord) {
      return NextResponse.json({
        isEligible: true,
        amount: parseFloat(eligibleRecord.amount)
      })
    } else {
      return NextResponse.json({ isEligible: false })
    }
  } catch (error) {
    console.error('Error checking eligibility:', error)
    return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 })
  }
}

