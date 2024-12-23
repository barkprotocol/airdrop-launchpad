import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Define input schema for validating the token sale ID parameter
const tokenSaleStatusParams = z.object({
  id: z.string().min(1, 'Token Sale ID is required').regex(/^\d+$/, 'Invalid Token Sale ID'), // ID should be a number
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tokenSaleId = url.searchParams.get('id');

    // Validate token sale ID parameter
    if (!tokenSaleId || !tokenSaleStatusParams.safeParse({ id: tokenSaleId }).success) {
      return NextResponse.json({ error: 'Invalid or missing token sale ID' }, { status: 400 });
    }

    // Fetch token sale data from the database
    const tokenSale = await prisma.token_sales.findUnique({
      where: {
        id: parseInt(tokenSaleId), // Convert ID to number for query
      },
    });

    // Check if the token sale exists
    if (!tokenSale) {
      return NextResponse.json({ error: 'Token Sale not found' }, { status: 404 });
    }

    // Calculate if the sale is active, completed, or paused
    const currentTime = new Date();
    let saleStatus = tokenSale.status;

    if (saleStatus === 'active' && currentTime < new Date(tokenSale.start_date)) {
      saleStatus = 'pending';  // Sale is not started yet
    } else if (saleStatus === 'active' && currentTime > new Date(tokenSale.end_date)) {
      saleStatus = 'completed';  // Sale has ended
    }

    // Return the token sale status
    return NextResponse.json({ 
      id: tokenSale.id,
      name: tokenSale.name,
      status: saleStatus,  // Active, Completed, Pending, or Paused
      start_date: tokenSale.start_date,
      end_date: tokenSale.end_date,
      total_tokens: tokenSale.total_tokens,
      price_per_token: tokenSale.price_per_token,
    });
  } catch (error) {
    console.error('Error fetching token sale status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
