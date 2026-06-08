import { pgTable, serial, text, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  bookingType: text("booking_type").notNull(),
  refId: integer("ref_id").notNull(),
  refName: text("ref_name").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull().default(1),
  status: text("status").notNull().default("pending"),
  qrCode: text("qr_code"),
  totalAmount: numeric("total_amount"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const savedItemsTable = pgTable("saved_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  refType: text("ref_type").notNull(),
  refId: integer("ref_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true, qrCode: true, status: true, createdAt: true, updatedAt: true,
});

export const createBookingSchema = z.object({
  bookingType: z.enum(["club", "tour", "dining", "event"]),
  refId: z.number().int().positive(),
  refName: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  guests: z.number().int().min(1).max(100),
  totalAmount: z.string().optional(),
  notes: z.string().optional(),
});

export type Booking = typeof bookingsTable.$inferSelect;
export type SavedItem = typeof savedItemsTable.$inferSelect;
