import { Express } from 'express';
import { storage } from '../storage';
import { insertCategorySchema } from '@shared/schema';
import { z } from 'zod';

// Middleware to check if user is admin (for future use)
const isAdmin = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden' });
};

export function registerCategoryRoutes(app: Express) {
  // Get all categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories', error });
    }
  });

  // Get category by id
  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }

      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch category', error });
    }
  });

  // Create new category (admin only - for future use)
  app.post('/api/categories', isAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid category data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create category', error });
      }
    }
  });
}
