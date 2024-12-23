import { body, validationResult } from 'express-validator';

/**
 * Middleware to validate Solana wallet addresses.
 */
export const validateWalletAddress = [
  body('walletAddress')
    .isString()
    .withMessage('Wallet address must be a string')
    .matches(/^([1-9A-HJ-NP-Za-km-z]{32,44})$/)
    .withMessage('Invalid Solana wallet address'),
];

/**
 * Middleware to validate token amount.
 */
export const validateAmount = [
  body('amount')
    .isDecimal({ decimal_digits: '0,9', min: 0.01 }) // Allows decimals up to 9 places, minimum 0.01
    .withMessage('Amount must be a positive decimal greater than 0'),
];

/**
 * Middleware to validate email format (optional).
 */
export const validateEmail = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
];

/**
 * Middleware to validate CSV file upload.
 */
export const validateCSVFile = [
  body('file')
    .exists()
    .withMessage('CSV file is required'),
];

/**
 * Utility middleware to handle validation results.
 * If validation fails, sends a 400 response with errors.
 */
export const handleValidationResult = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
