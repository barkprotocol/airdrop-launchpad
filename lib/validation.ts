import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validate if the wallet address is a valid Solana wallet address
export const validateWalletAddress = [
  body('walletAddress')
    .isString()
    .withMessage('Wallet address must be a string')
    .matches(/^([1-9A-HJ-NP-Za-km-z]{32,44})$/)
    .withMessage('Invalid Solana wallet address'),
];

// Validate if the amount is a valid number and above a threshold
export const validateAmount = [
  body('amount')
    .isDecimal({ min: 0.01 })  // Allowing decimal values above 0.01 (for token amounts)
    .withMessage('Amount must be a positive decimal greater than 0'),
];

// Validate email format (optional)
export const validateEmail = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
];

// Utility function to handle validation results
export const handleValidationResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
