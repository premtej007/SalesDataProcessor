import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeAmazonProduct } from "./scraper";
import { optimizeProductListing } from "./gemini";
import { asinSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/optimize - Scrape Amazon product, optimize with AI, and save to database
  app.post("/api/optimize", async (req, res) => {
    try {
      // Validate ASIN input
      const { asin } = asinSchema.parse(req.body);

      // Step 1: Scrape Amazon product data
      let productData;
      try {
        productData = await scrapeAmazonProduct(asin);
      } catch (error) {
        return res.status(400).json({
          message: error instanceof Error ? error.message : "Failed to fetch product data from Amazon",
        });
      }

      // Step 2: Optimize with Gemini AI
      let optimizedData;
      try {
        optimizedData = await optimizeProductListing(
          productData.title,
          productData.bullets,
          productData.description
        );
      } catch (error) {
        return res.status(500).json({
          message: error instanceof Error ? error.message : "Failed to optimize listing with AI",
        });
      }

      // Step 3: Save to database
      const optimization = await storage.createOptimization({
        asin,
        originalTitle: productData.title,
        originalBullets: productData.bullets,
        originalDescription: productData.description,
        optimizedTitle: optimizedData.optimizedTitle,
        optimizedBullets: optimizedData.optimizedBullets,
        optimizedDescription: optimizedData.optimizedDescription,
        suggestedKeywords: optimizedData.suggestedKeywords,
      });

      res.json(optimization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid ASIN format",
          errors: error.errors,
        });
      }

      console.error("Optimization error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  });

  // GET /api/history - Get all optimization history
  app.get("/api/history", async (req, res) => {
    try {
      const optimizations = await storage.getAllOptimizations();
      res.json(optimizations);
    } catch (error) {
      console.error("History fetch error:", error);
      res.status(500).json({
        message: "Failed to fetch optimization history",
      });
    }
  });

  // GET /api/history/:asin - Get optimization history for specific ASIN
  app.get("/api/history/:asin", async (req, res) => {
    try {
      const asin = req.params.asin.toUpperCase();
      const optimizations = await storage.getOptimizationsByAsin(asin);
      res.json(optimizations);
    } catch (error) {
      console.error("ASIN history fetch error:", error);
      res.status(500).json({
        message: "Failed to fetch ASIN history",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
