import { Express } from 'express';
import { storage } from '../storage';

// Middleware to check if user is authenticated
const isAuthenticated = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export function registerOrderRoutes(app: Express) {
  // Get user orders
  app.get('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders', error });
    }
  });

  // Get order by id
  app.get('/api/orders/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
      }
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Check if order belongs to user
      if (order.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch order', error });
    }
  });

  // Cancel order
  app.post('/api/orders/:id/cancel', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
      }
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Check if order belongs to user
      if (order.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Check if order can be cancelled
      if (order.status !== 'pending' && order.status !== 'processing') {
        return res.status(400).json({ message: 'Order cannot be cancelled' });
      }
      
      // Update order status
      const updatedOrder = await storage.updateOrder(orderId, {
        status: 'cancelled'
      });
      
      // If paid with wallet, refund the amount
      if (order.paymentMethod === 'wallet') {
        const wallet = await storage.getWallet(userId);
        
        if (wallet) {
          await storage.updateWallet(userId, {
            balance: wallet.balance + order.total,
            totalExpenses: wallet.totalExpenses - order.total
          });
          
          // Create refund transaction
          await storage.createTransaction({
            userId,
            type: 'refund',
            amount: order.total,
            description: 'Order cancellation refund',
            status: 'completed',
            reference: `refund-${orderId}`
          });
        }
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Failed to cancel order', error });
    }
  });
}
