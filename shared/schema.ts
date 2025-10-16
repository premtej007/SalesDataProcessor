import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Optimizations table for storing Amazon product listing optimizations
export const optimizations = pgTable("optimizations", {
  id: serial("id").primaryKey(),
  asin: varchar("asin", { length: 10 }).notNull(),
  
  // Original content from Amazon
  originalTitle: text("original_title").notNull(),
  originalBullets: text("original_bullets").array().notNull(),
  originalDescription: text("original_description").notNull(),
  
  // AI-optimized content
  optimizedTitle: text("optimized_title").notNull(),
  optimizedBullets: text("optimized_bullets").array().notNull(),
  optimizedDescription: text("optimized_description").notNull(),
  suggestedKeywords: text("suggested_keywords").array().notNull(),
  
  // Metadata
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schema for creating new optimizations
export const insertOptimizationSchema = createInsertSchema(optimizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertOptimization = z.infer<typeof insertOptimizationSchema>;
export type Optimization = typeof optimizations.$inferSelect;

// ASIN validation schema for frontend forms
export const asinSchema = z.object({
  asin: z.string()
    .min(10, "ASIN must be 10 characters")
    .max(10, "ASIN must be 10 characters")
    .regex(/^[A-Z0-9]{10}$/, "ASIN must contain only uppercase letters and numbers"),
});

export type AsinInput = z.infer<typeof asinSchema>;
