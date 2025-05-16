import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

// Import API route handlers
import { registerProductRoutes } from "./api/products";
import { registerCategoryRoutes } from "./api/categories";
import { registerWalletRoutes } from "./api/wallet";
import { registerCartRoutes } from "./api/cart";
import { registerTransactionRoutes } from "./api/transactions";
import { registerOrderRoutes } from "./api/orders";
import { registerProfileRoutes } from "./api/profile";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Setup API routes
  registerProductRoutes(app);
  registerCategoryRoutes(app);
  registerWalletRoutes(app);
  registerCartRoutes(app);
  registerTransactionRoutes(app);
  registerOrderRoutes(app);
  registerProfileRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
