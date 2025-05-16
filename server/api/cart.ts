import { Express } from 'express';
import { storage } from '../storage';
import { insertCartItemSchema } from '@shared/schema';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Middleware to check if user is authenticated
const isAuthenticated = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Validation schemas
const cartItemUpdateSchema = z.object({
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  method: z.string(),
  couponCode: z.string().optional(),
});

export function registerCartRoutes(app: Express) {
  // Get user cart
  app.get('/api/cart', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch cart items', error });
    }
  });

  // Add item to cart
  app.post('/api/cart', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      
      // Check if product exists
      const product = await storage.getProduct(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Check if the item is already in the cart
      const existingCartItems = await storage.getCartItems(userId);
      const existingItem = existingCartItems.find(item => item.productId === cartItemData.productId);
      
      if (existingItem) {
        // Update quantity if already in cart
        const updatedItem = await storage.updateCartItem(existingItem.id, {
          quantity: existingItem.quantity + (cartItemData.quantity || 1)
        });
        return res.json(updatedItem);
      }
      
      // Add new item to cart
      const cartItem = await storage.createCartItem(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid cart item data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to add item to cart', error });
      }
    }
  });

  // Update cart item quantity
  app.patch('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
      
      const { quantity } = cartItemUpdateSchema.parse(req.body);
      
      // Get cart item
      const cartItem = await storage.getCartItem(itemId);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      // Check if cart item belongs to user
      if (cartItem.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Update cart item
      const updatedItem = await storage.updateCartItem(itemId, { quantity });
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid cart item data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update cart item', error });
      }
    }
  });

  // Remove item from cart
  app.delete('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
      
      // Get cart item
      const cartItem = await storage.getCartItem(itemId);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      // Check if cart item belongs to user
      if (cartItem.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Delete cart item
      await storage.deleteCartItem(itemId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove item from cart', error });
    }
  });

  // Checkout
  app.post('/api/cart/checkout', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { method, couponCode } = checkoutSchema.parse(req.body);
      
      // Get cart items
      const cartItems = await storage.getCartItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      
      // Calculate total amount
      let subtotal = 0;
      const itemDetails = [];
      
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        itemDetails.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          total: itemTotal
        });
      }
      
      // Apply discount if coupon code is valid
      let discount = 0;
      if (couponCode === 'WELCOME') {
        discount = subtotal * 0.1; // 10% discount
      }
      
      const shipping = 10; // Fixed shipping cost
      const total = subtotal + shipping - discount;
      
      if (method === 'wallet') {
        // Pay using wallet
        const wallet = await storage.getWallet(userId);
        if (!wallet) {
          return res.status(404).json({ message: 'Wallet not found' });
        }
        
        if (wallet.balance < total) {
          return res.status(400).json({ message: 'Insufficient wallet balance' });
        }
        
        // Update wallet balance
        await storage.updateWallet(userId, {
          balance: wallet.balance - total,
          totalExpenses: wallet.totalExpenses + total
        });
        
        // Create transaction record
        await storage.createTransaction({
          userId,
          type: 'purchase',
          amount: total,
          description: 'Order payment',
          status: 'completed',
          reference: uuidv4()
        });
        
        // Create order
        const order = await storage.createOrder({
          userId,
          total,
          status: 'processing',
          paymentMethod: 'wallet',
          items: itemDetails,
          shippingAddress: null
        });
        
        // Clear cart
        await storage.clearCart(userId);
        
        res.json({ success: true, order });
      } else if (method === 'paystack') {
        // Paystack payment (simulated since we don't have actual API keys)
        
        // Create order with pending status
        const order = await storage.createOrder({
          userId,
          total,
          status: 'pending',
          paymentMethod: 'paystack',
          items: itemDetails,
          shippingAddress: null
        });
        
        // In a real implementation, we would redirect to Paystack payment page
        // For simulation, we'll return a success response
        res.json({
          success: true,
          order,
          redirectUrl: '/paystack-callback?reference=' + uuidv4()
        });
      } else {
        res.status(400).json({ message: 'Invalid payment method' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid checkout data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to process checkout', error });
      }
    }
  });

  // Paystack callback (simulated)
  app.get('/api/paystack-callback', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const reference = req.query.reference as string;
      
      if (!reference) {
        return res.status(400).json({ message: 'Payment reference is required' });
      }
      
      // In a real implementation, we would verify the payment with Paystack
      // For simulation, we'll assume the payment was successful
      
      // Get the user's pending order
      const orders = await storage.getOrders(userId);
      const pendingOrder = orders.find(order => order.status === 'pending' && order.paymentMethod === 'paystack');
      
      if (!pendingOrder) {
        return res.status(404).json({ message: 'No pending order found' });
      }
      
      // Update order status
      await storage.updateOrder(pendingOrder.id, {
        status: 'processing'
      });
      
      // Create transaction record
      await storage.createTransaction({
        userId,
        type: 'purchase',
        amount: pendingOrder.total,
        description: 'Order payment via Paystack',
        status: 'completed',
        reference
      });
      
      // Clear cart
      await storage.clearCart(userId);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to process payment callback', error });
    }
  });
}
