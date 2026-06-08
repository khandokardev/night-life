import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const promotionsTable = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  imageUrl: text("image_url"),
  type: text("type").notNull().default("banner"),
  targetAll: boolean("target_all").notNull().default(true),
  active: boolean("active").notNull().default(true),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appSettingsTable = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Promotion = typeof promotionsTable.$inferSelect;
export type AppSetting = typeof appSettingsTable.$inferSelect;
