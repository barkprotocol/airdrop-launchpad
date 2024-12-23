import { prisma } from './prisma';
import axios from 'axios';

// Example: Function to mint an NFT
export async function mintNFT(userId: number, metadata: string, imageUrl: string) {
  try {
    const nftData = {
      userId,
      metadata,
      imageUrl,
      createdAt: new Date(),
    };

    const createdNFT = await prisma.nFT.create({
      data: nftData,
    });

    // Call external API to mint the NFT on Solana (or other blockchain)
    const response = await axios.post('/api/mint-nft', {
      nftData,
    });

    if (response.status === 200) {
      return createdNFT;
    } else {
      throw new Error('Failed to mint NFT');
    }
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new Error('Unable to mint NFT');
  }
}

// Example: Function to transfer an NFT to another wallet
export async function transferNFT(nftId: number, toWallet: string) {
  try {
    // Retrieve NFT data
    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
    });

    if (!nft) {
      throw new Error('NFT not found');
    }

    // Call API or blockchain network to handle the transfer
    const response = await axios.post('/api/transfer-nft', {
      nftId,
      toWallet,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to transfer NFT');
    }
  } catch (error) {
    console.error('Error transferring NFT:', error);
    throw new Error('Unable to transfer NFT');
  }
}

// Example: Function to get metadata of a specific NFT
export async function getNFTMetadata(nftId: number) {
  try {
    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
    });

    if (!nft) {
      throw new Error('NFT not found');
    }

    // Fetch additional metadata (if any)
    const metadata = await axios.get(`https://api.barkprotocol.net/nft-metadata/${nftId}`);

    return { ...nft, metadata: metadata.data };
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    throw new Error('Unable to fetch NFT metadata');
  }
}
