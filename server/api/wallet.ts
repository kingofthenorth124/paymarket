import { Express } from 'express';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Middleware to check if user is authenticated
const isAuthenticated = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Validation schemas
const depositSchema = z.object({
  amount: z.number().positive().min(10, "Minimum deposit is $10").max(10000, "Maximum deposit is $10,000"),
});

const withdrawSchema = z.object({
  amount: z.number().positive().min(10, "Minimum withdrawal is $10"),
  address: z.string().min(1, "Blockchain address is required"),
});

export function registerWalletRoutes(app: Express) {
  // Get user wallet
  app.get('/api/wallet', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      let wallet = await storage.getWallet(userId);
      
      if (!wallet) {
        // Create a new wallet if one doesn't exist
        const walletAddress = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        wallet = await storage.createWallet({
          userId,
          balance: 0,
          address: walletAddress,
          totalIncome: 0,
          totalExpenses: 0
        });
      }
      
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch wallet', error });
    }
  });

  // Deposit funds
  app.post('/api/wallet/deposit', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount } = depositSchema.parse(req.body);
      
      let wallet = await storage.getWallet(userId);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      
      // Update wallet balance
      const updatedWallet = await storage.updateWallet(userId, {
        balance: wallet.balance + amount,
        totalIncome: wallet.totalIncome + amount
      });
      
      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        type: 'deposit',
        amount,
        description: 'Wallet deposit',
        status: 'completed',
        reference: uuidv4()
      });
      
      res.json({ wallet: updatedWallet, transaction });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid deposit data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to process deposit', error });
      }
    }
  });

  // Withdraw funds
  app.post('/api/wallet/withdraw', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, address } = withdrawSchema.parse(req.body);
      
      let wallet = await storage.getWallet(userId);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      
      // Check if user has sufficient balance
      if (wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      
      // Update wallet balance
      const updatedWallet = await storage.updateWallet(userId, {
        balance: wallet.balance - amount,
        totalExpenses: wallet.totalExpenses + amount
      });
      
      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        type: 'withdraw',
        amount,
        description: `Withdrawal to ${address.substring(0, 8)}...`,
        status: 'completed',
        reference: uuidv4()
      });
      
      res.json({ wallet: updatedWallet, transaction });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid withdrawal data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to process withdrawal', error });
      }
    }
  });
}
