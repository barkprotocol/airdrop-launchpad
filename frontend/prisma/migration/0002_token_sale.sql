-- 0002_token_sale.sql
-- Migration for token sale feature

-- Create a table for tracking token sale campaigns
CREATE TABLE token_sales (
    id SERIAL PRIMARY KEY,  -- Unique identifier for each token sale campaign
    name VARCHAR(255) NOT NULL,  -- Name of the token sale
    start_date TIMESTAMP NOT NULL,  -- Start date of the token sale
    end_date TIMESTAMP NOT NULL,  -- End date of the token sale
    total_tokens BIGINT NOT NULL,  -- Total number of tokens available for sale
    price_per_token DECIMAL(18, 8) NOT NULL,  -- Price per token in SOL or other currency
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- Status of the sale (active, completed, paused)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the sale was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the sale was last updated
);

-- Create a table for token sale transactions
CREATE TABLE token_sale_transactions (
    id SERIAL PRIMARY KEY,  -- Unique identifier for each transaction
    token_sale_id INTEGER REFERENCES token_sales(id) ON DELETE CASCADE,  -- Link to the token sale campaign
    wallet_address VARCHAR(255) NOT NULL,  -- Wallet address of the user participating in the token sale
    amount DECIMAL(18, 8) NOT NULL,  -- Number of tokens purchased
    total_cost DECIMAL(18, 8) NOT NULL,  -- Total cost of the tokens purchased
    transaction_signature VARCHAR(255),  -- Transaction signature from Solana
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- Transaction status (pending, completed, failed)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the transaction creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the transaction was last updated
);

-- Add indexes for faster querying
CREATE INDEX idx_token_sale_transactions_wallet_address ON token_sale_transactions(wallet_address);
CREATE INDEX idx_token_sale_transactions_status ON token_sale_transactions(status);

-- Add a column to track the number of tokens claimed by a wallet
ALTER TABLE users ADD COLUMN claimed_tokens BIGINT DEFAULT 0;  -- Track number of claimed tokens

-- Add a table to track airdrop wallet balances (optional, if used for airdrop-related logic)
CREATE TABLE airdrop_wallets (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,  -- Wallet address associated with airdrop
    balance DECIMAL(18, 8) NOT NULL DEFAULT 0,  -- Current balance of tokens in the airdrop wallet
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when balance was last updated
);

-- Create a view to aggregate the total tokens sold in each campaign
CREATE VIEW token_sales_summary AS
SELECT
    ts.id,
    ts.name,
    SUM(tst.amount) AS total_tokens_sold,
    ts.total_tokens - SUM(tst.amount) AS remaining_tokens
FROM token_sales ts
LEFT JOIN token_sale_transactions tst ON ts.id = tst.token_sale_id
GROUP BY ts.id;

-- Add constraints for data integrity (if needed)
ALTER TABLE token_sale_transactions
    ADD CONSTRAINT fk_token_sale_id FOREIGN KEY (token_sale_id) REFERENCES token_sales(id);
