import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).adminId) {
    next();
  } else {
    res.status(401).json({ message: "Authentication required" });
  }
}

// File upload configuration with security
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if it doesn't exist
  try {
    await fs.mkdir('uploads', { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Compare password with bcrypt hash
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store admin session
      (req.session as any).adminId = user.id;
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    if (req.session && (req.session as any).adminId) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", requireAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Move file to a permanent location with security
      const fileExtension = path.extname(req.file.originalname);
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      
      if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        return res.status(400).json({ message: "Invalid file extension" });
      }

      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      const permanentPath = path.join('uploads', fileName);
      
      await fs.rename(req.file.path, permanentPath);
      
      res.json({ 
        message: "File uploaded successfully",
        filename: fileName,
        url: `/uploads/${fileName}`
      });
    } catch (error) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  // Serve uploaded files with security
  app.get("/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: "Invalid filename" });
    }
    
    // Only allow specific file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = path.extname(filename);
    
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      return res.status(404).json({ message: "File not found" });
    }
    
    const filepath = path.join(process.cwd(), 'uploads', filename);
    
    // Check if file exists and is within uploads directory
    fs.access(filepath)
      .then(() => {
        const realPath = require('fs').realpathSync(filepath);
        const uploadsDir = require('fs').realpathSync(path.join(process.cwd(), 'uploads'));
        
        if (!realPath.startsWith(uploadsDir)) {
          return res.status(403).json({ message: "Access denied" });
        }
        
        res.sendFile(realPath);
      })
      .catch(() => {
        res.status(404).json({ message: "File not found" });
      });
  });

  // Create product (admin only)
  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const validation = insertProductSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validation.error.errors });
      }

      const product = await storage.createProduct(validation.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderSchema = insertOrderSchema.extend({
        items: z.array(insertOrderItemSchema.omit({ orderId: true }))
      });

      const validation = orderSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid order data", errors: validation.error.errors });
      }

      const { items, ...orderData } = validation.data;
      
      // Create order
      const order = await storage.createOrder(orderData);
      
      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          ...item,
          orderId: order.id,
        });
      }

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get all orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const items = await storage.getOrderItems(id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Update product (admin only)
  app.put("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertProductSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validation.error.errors });
      }

      const product = await storage.updateProduct(id, validation.data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product (admin only)
  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
