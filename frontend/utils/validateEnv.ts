import dotenv from 'dotenv';
import { cleanEnv, str, url, port } from 'envalid';

// Load environment variables from a .env file
dotenv.config();

export function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 3000 }),
    DATABASE_URL: url(),
    NEXT_PUBLIC_SUPABASE_URL: url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str(),
    NEXT_PUBLIC_SOLANA_RPC_URL: url(),
    JWT_SECRET: str(),
    SECRET_KEY: str(),
    TOKEN_PROGRAM_ID: str(),
    NFT_PROGRAM_ID: str(),
  });
}
