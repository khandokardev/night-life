import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  phone: text("phone"),
  name: text("name").notNull(),
  avatar: text("avatar"),
  passwordHash: text("password_hash"),
  role: text("role").notNull().default("user"),
  suspended: boolean("suspended").notNull().default(false),
  bannedAt: timestamp("banned_at"),
  verificationStatus: text("verification_status").notNull().default("unverified"),
  lastLoginAt: timestamp("last_login_at"),
  loginCount: integer("login_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const refreshTokensTable = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true, passwordHash: true, createdAt: true, updatedAt: true,
});

export const registerSchema = z.object({
  email: z.email().optional(),
  phone: z.string().min(7).optional(),
  name: z.string().min(1),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
