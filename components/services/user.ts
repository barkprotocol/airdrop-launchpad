import { Request, Response } from 'express';
import { getUserByWalletAddress, createUser } from '../services/user';

// Controller to get a user by wallet address
export async function getUserByWallet(req: Request, res: Response): Promise<Response> {
  const { walletAddress } = req.params;

  try {
    const user = await getUserByWalletAddress(walletAddress);

    if (!user) {
      return res.status(404).json({ error: 'User not found for this wallet address' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Unable to fetch user' });
  }
}

// Controller to create a new user
export async function createNewUser(req: Request, res: Response): Promise<Response> {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const user = await createUser(walletAddress);

    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Unable to create user' });
  }
}

// Controller to get all users (optional, depending on your use case)
export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Unable to fetch users' });
  }
}

// Controller to delete a user by wallet address (optional, depending on your use case)
export async function deleteUser(req: Request, res: Response): Promise<Response> {
  const { walletAddress } = req.params;

  try {
    const user = await prisma.user.delete({
      where: { walletAddress },
    });

    return res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Unable to delete user' });
  }
}
