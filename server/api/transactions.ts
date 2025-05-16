import { Express } from 'express';
import { storage } from '../storage';

// Middleware to check if user is authenticated
const isAuthenticated = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export function registerTransactionRoutes(app: Express) {
  // Get user transactions
  app.get('/api/transactions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transactions', error });
    }
  });

  // Get transaction by id
  app.get('/api/transactions/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const transactionId = parseInt(req.params.id);
      
      if (isNaN(transactionId)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
      }
      
      const transaction = await storage.getTransaction(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      // Check if transaction belongs to user
      if (transaction.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transaction', error });
    }
  });
}
