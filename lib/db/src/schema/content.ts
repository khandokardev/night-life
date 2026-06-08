import { pgTable, serial, text, boolean, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const contentBase = {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  images: text("images").array(),
  price: numeric("price"),
  address: text("address"),
  mapsUrl: text("maps_url"),
  phone: text("phone"),
  contactEmail: text("contact_email"),
  isTrending: boolean("is_trending").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPopular: boolean("is_popular").notNull().default(false),
  available: boolean("available").notNull().default(true),
  tags: text("tags").array(),
  categoryId: integer("category_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

export const clubsTable = pgTable("clubs", {
  ...contentBase,
  dressCode: text("dress_code"),
  openingHours: text("opening_hours"),
  minSpend: numeric("min_spend"),
});

export const restaurantsTable = pgTable("restaurants", {
  ...contentBase,
  cuisine: text("cuisine"),
  openingHours: text("opening_hours"),
  dressCode: text("dress_code"),
  reservationRequired: boolean("reservation_required").notNull().default(false),
});

export const toursTable = pgTable("tours", {
  ...contentBase,
  duration: text("duration"),
  includes: text("includes").array(),
  maxGroupSize: integer("max_group_size"),
  meetingPoint: text("meeting_point"),
});

export const productsTable = pgTable("products", {
  ...contentBase,
  sku: text("sku"),
  stock: integer("stock").notNull().default(0),
  brand: text("brand"),
  sizes: text("sizes").array(),
  colours: text("colours").array(),
});

export const eventsTable = pgTable("events", {
  ...contentBase,
  eventDate: text("event_date"),
  eventTime: text("event_time"),
  venue: text("venue"),
  dressCode: text("dress_code"),
  lineup: text("lineup").array(),
  ticketUrl: text("ticket_url"),
});

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true, createdAt: true });
export const insertClubSchema = createInsertSchema(clubsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRestaurantSchema = createInsertSchema(restaurantsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTourSchema = createInsertSchema(toursTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true, updatedAt: true });

export type Club = typeof clubsTable.$inferSelect;
export type Restaurant = typeof restaurantsTable.$inferSelect;
export type Tour = typeof toursTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;
export type Event = typeof eventsTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
