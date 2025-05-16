import { users, User, InsertUser, categories, Category, InsertCategory, products, Product, InsertProduct, cartItems, CartItem, InsertCartItem, wallets, Wallet, InsertWallet, transactions, Transaction, InsertTransaction, orders, Order, InsertOrder, profiles, Profile, InsertProfile } from "@shared/schema";
import { randomBytes } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined>;

  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, data: Partial<CartItem>): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Wallet operations
  getWallet(userId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(userId: number, data: Partial<Wallet>): Promise<Wallet | undefined>;

  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined>;

  // Profile operations
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: number, data: Partial<Profile>): Promise<Profile | undefined>;

  // Session store
  sessionStore: session.SessionStore;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private orders: Map<number, Order>;
  private profiles: Map<number, Profile>;
  
  currentUserId: number;
  currentCategoryId: number;
  currentProductId: number;
  currentCartItemId: number;
  currentWalletId: number;
  currentTransactionId: number;
  currentOrderId: number;
  currentProfileId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.orders = new Map();
    this.profiles = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentWalletId = 1;
    this.currentTransactionId = 1;
    this.currentOrderId = 1;
    this.currentProfileId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with demo data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    
    // Create default wallet for new user
    const walletAddress = `0x${randomBytes(20).toString('hex')}`;
    await this.createWallet({
      userId: id,
      balance: 0,
      address: walletAddress,
      totalIncome: 0,
      totalExpenses: 0
    });
    
    // Create default profile
    await this.createProfile({
      userId: id,
      fullName: insertUser.fullName || '',
      email: insertUser.email || '',
      phone: '',
      address: '',
      country: insertUser.country || ''
    });
    
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const now = new Date();
    const newCategory: Category = { ...category, id, createdAt: now };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const newProduct: Product = { ...product, id, createdAt: now };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...data };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(item: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const now = new Date();
    const newItem: CartItem = { ...item, id, createdAt: now };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, data: Partial<CartItem>): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...data };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
    
    for (const item of userCartItems) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }

  // Wallet methods
  async getWallet(userId: number): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId
    );
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const id = this.currentWalletId++;
    const now = new Date();
    const newWallet: Wallet = { ...wallet, id, createdAt: now };
    this.wallets.set(id, newWallet);
    return newWallet;
  }

  async updateWallet(userId: number, data: Partial<Wallet>): Promise<Wallet | undefined> {
    const wallet = Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId
    );
    
    if (!wallet) return undefined;
    
    const updatedWallet = { ...wallet, ...data };
    this.wallets.set(wallet.id, updatedWallet);
    return updatedWallet;
  }

  // Transaction methods
  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const now = new Date();
    const newTransaction: Transaction = { ...transaction, id, createdAt: now };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    const newOrder: Order = { ...order, id, createdAt: now };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...data };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Profile methods
  async getProfile(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const now = new Date();
    const newProfile: Profile = { ...profile, id, createdAt: now };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async updateProfile(userId: number, data: Partial<Profile>): Promise<Profile | undefined> {
    const profile = Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId
    );
    
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.profiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  // Initialize demo data
  private async initializeData() {
    // Create demo categories
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Fashion', description: 'Clothing, shoes, and accessories' },
      { name: 'Home', description: 'Home decor and furnishings' },
      { name: 'Health', description: 'Health and wellness products' },
      { name: 'Gaming', description: 'Video games and gaming accessories' },
      // Financial Services Categories
      { name: 'Payments', description: 'Digital wallets, mobile payments, and payment gateways' },
      { name: 'Lending', description: 'P2P lending, credit services, and fintech lenders' },
      { name: 'Insurance', description: 'Digital insurance services and products' },
      { name: 'Blockchain', description: 'Cryptocurrency, blockchain services, and NFTs' }
    ];
    
    for (const category of categories) {
      await this.createCategory(category);
    }
    
    // Create demo products
    const products = [
      {
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 149.99,
        categoryId: 1,
        stock: 50,
        featured: true
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring features',
        price: 199.99,
        categoryId: 1,
        stock: 30,
        featured: true
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Stylish leather bag for everyday use',
        price: 89.99,
        categoryId: 2,
        stock: 25,
        featured: true
      },
      {
        name: 'Modern Desk Lamp',
        description: 'Adjustable desk lamp with modern design',
        price: 39.99,
        categoryId: 3,
        stock: 40,
        featured: true
      },
      {
        name: 'Fitness Tracker',
        description: 'Waterproof fitness tracker with heart rate monitor',
        price: 79.99,
        categoryId: 4,
        stock: 35,
        featured: false
      },
      {
        name: 'Wireless Gaming Controller',
        description: 'Premium controller for console and PC gaming',
        price: 69.99,
        categoryId: 5,
        stock: 20,
        featured: false
      },
      {
        name: 'Ultrabook Laptop',
        description: 'Thin and lightweight laptop for productivity',
        price: 899.99,
        categoryId: 1,
        stock: 15,
        featured: false
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish sunglasses with UV protection',
        price: 129.99,
        categoryId: 2,
        stock: 30,
        featured: false
      },
      // Payment Services
      {
        name: 'Digital Wallet Premium',
        description: 'Advanced digital wallet with multi-currency support and zero transaction fees',
        price: 9.99,
        categoryId: 6,
        stock: 999,
        featured: true
      },
      {
        name: 'Mobile Payment Gateway',
        description: 'Secure mobile payment processing solution for businesses',
        price: 29.99,
        categoryId: 6,
        stock: 500,
        featured: true
      },
      {
        name: 'Paystack Payment Integration',
        description: 'Complete Paystack integration package with credit card processing',
        price: 49.99,
        categoryId: 6,
        stock: 300,
        featured: false
      },
      // Lending Services
      {
        name: 'P2P Lending Platform Access',
        description: 'Access to our peer-to-peer lending network with verified borrowers',
        price: 19.99,
        categoryId: 7,
        stock: 200,
        featured: true
      },
      {
        name: 'Business Microloan Package',
        description: 'Quick access to small business loans with competitive interest rates',
        price: 99.99,
        categoryId: 7,
        stock: 100,
        featured: false
      },
      // Insurance Services
      {
        name: 'Digital Device Insurance',
        description: 'Comprehensive insurance for all your electronic devices',
        price: 14.99,
        categoryId: 8,
        stock: 1000,
        featured: false
      },
      {
        name: 'Travel Insurance Premium',
        description: 'Global travel insurance with COVID-19 coverage',
        price: 24.99,
        categoryId: 8,
        stock: 800,
        featured: true
      },
      // Blockchain Services
      {
        name: 'Cryptocurrency Starter Pack',
        description: 'Everything you need to start investing in cryptocurrency',
        price: 79.99,
        categoryId: 9,
        stock: 250,
        featured: true
      },
      {
        name: 'Blockchain Development Kit',
        description: 'Tools and resources for building on blockchain technology',
        price: 149.99,
        categoryId: 9,
        stock: 150,
        featured: false
      },
      {
        name: 'NFT Creation Service',
        description: 'Create and mint your own NFTs with our easy-to-use service',
        price: 39.99,
        categoryId: 9,
        stock: 300,
        featured: false
      }
    ];
    
    for (const product of products) {
      await this.createProduct(product);
    }
  }
}

export const storage = new MemStorage();
