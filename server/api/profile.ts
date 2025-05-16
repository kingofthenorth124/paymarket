import { Express } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Validation schemas
const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Please select your country"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function registerProfileRoutes(app: Express) {
  // Get user profile
  app.get('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      let profile = await storage.getProfile(userId);
      
      if (!profile) {
        // Create a profile if it doesn't exist
        profile = await storage.createProfile({
          userId,
          fullName: req.user.fullName || '',
          email: req.user.email || '',
          phone: '',
          address: '',
          country: req.user.country || ''
        });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch profile', error });
    }
  });

  // Update user profile
  app.patch('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const profileData = profileUpdateSchema.parse(req.body);
      
      // Update user data
      await storage.updateUser(userId, {
        fullName: profileData.fullName,
        email: profileData.email,
        country: profileData.country
      });
      
      // Update or create profile
      let profile = await storage.getProfile(userId);
      
      if (profile) {
        profile = await storage.updateProfile(userId, profileData);
      } else {
        profile = await storage.createProfile({
          userId,
          ...profileData
        });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid profile data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update profile', error });
      }
    }
  });

  // Update user password
  app.patch('/api/profile/password', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = passwordUpdateSchema.parse(req.body);
      
      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(userId, {
        password: hashedPassword
      });
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid password data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update password', error });
      }
    }
  });
}
