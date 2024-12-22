import { NextResponse } from 'next/server';
import { validateWalletAddress, validateAmount, validateEmail, handleValidationResult } from '@/lib/validation';
import { body, validationResult } from 'express-validator';

// POST route to handle validation logic for wallet, amount, and email
export async function POST(req: Request) {
  // Parse the JSON body from the request
  const requestBody = await req.json();
  
  // Create a mock express request object
  const mockRequest: any = {
    body: requestBody,
  };

  // Perform validation (using express-validator middleware)
  await Promise.all([
    validateWalletAddress[0](mockRequest, {} as any, () => {}),
    validateAmount[0](mockRequest, {} as any, () => {}),
    validateEmail[0](mockRequest, {} as any, () => {}),
  ]);

  // Check if there are validation errors
  const errors = validationResult(mockRequest);
  if (!errors.isEmpty()) {
    return NextResponse.json({ errors: errors.array() }, { status: 400 });
  }

  // If validation passes, return success response
  return NextResponse.json({ message: 'Validation succeeded' }, { status: 200 });
}
