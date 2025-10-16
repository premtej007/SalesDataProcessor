// Reference: javascript_database blueprint
import { optimizations, type Optimization, type InsertOptimization } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Optimization operations
  createOptimization(optimization: InsertOptimization): Promise<Optimization>;
  getOptimizationsByAsin(asin: string): Promise<Optimization[]>;
  getAllOptimizations(): Promise<Optimization[]>;
}

export class DatabaseStorage implements IStorage {
  async createOptimization(insertOptimization: InsertOptimization): Promise<Optimization> {
    const [optimization] = await db
      .insert(optimizations)
      .values(insertOptimization)
      .returning();
    return optimization;
  }

  async getOptimizationsByAsin(asin: string): Promise<Optimization[]> {
    const results = await db
      .select()
      .from(optimizations)
      .where(eq(optimizations.asin, asin))
      .orderBy(desc(optimizations.createdAt));
    return results;
  }

  async getAllOptimizations(): Promise<Optimization[]> {
    const results = await db
      .select()
      .from(optimizations)
      .orderBy(desc(optimizations.createdAt));
    return results;
  }
}

export const storage = new DatabaseStorage();
