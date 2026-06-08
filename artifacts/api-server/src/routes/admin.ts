import { Router } from "express";
import { eq, count, desc, gte, sql, and, isNotNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import { db } from "@workspace/db";
import {
  categoriesTable, clubsTable, restaurantsTable, toursTable, productsTable, eventsTable,
  insertCategorySchema, insertClubSchema, insertRestaurantSchema, insertTourSchema, insertProductSchema, insertEventSchema,
  bookingsTable, usersTable, reviewsTable, notificationsTable, promotionsTable, appSettingsTable,
  chatMessagesTable, transactionsTable,
} from "@workspace/db/schema";
import { requireAdmin, type AuthRequest } from "../middlewares/auth.js";
import { z } from "zod";

const STRIPE_SECRET = process.env["STRIPE_SECRET_KEY"] ?? "";

const router = Router();
router.use(requireAdmin);

const ADMIN_ROLES = ["owner", "super_admin", "admin", "editor", "support", "user"] as const;

// ── Analytics ─────────────────────────────────────────────────────────────────
router.get("/analytics", async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    [totalUsersRow], [totalBookings], [confirmedBookings], [pendingBookings],
    [totalReviews], [pendingReviews], [activePromotions], [totalRevenueRow],
    [activeUsersRow], [newUsersTodayRow], [pendingChatsRow], recentRegistrations,
  ] = await Promise.all([
    db.select({ count: count() }).from(usersTable),
    db.select({ count: count() }).from(bookingsTable),
    db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed")),
    db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending")),
    db.select({ count: count() }).from(reviewsTable),
    db.select({ count: count() }).from(reviewsTable).where(eq(reviewsTable.approved, false)),
    db.select({ count: count() }).from(promotionsTable).where(eq(promotionsTable.active, true)),
    db.select({ total: sql<string>`coalesce(sum(${transactionsTable.amount}), 0)` })
      .from(transactionsTable).where(eq(transactionsTable.status, "succeeded")),
    db.select({ count: count() }).from(usersTable)
      .where(and(isNotNull(usersTable.lastLoginAt), gte(usersTable.lastLoginAt, thirtyDaysAgo))),
    db.select({ count: count() }).from(usersTable).where(gte(usersTable.createdAt, today)),
    db.select({ count: sql<number>`count(distinct ${chatMessagesTable.userId})` })
      .from(chatMessagesTable).where(eq(chatMessagesTable.sender, "user")),
    db.select({
      id: usersTable.id, name: usersTable.name, email: usersTable.email,
      role: usersTable.role, createdAt: usersTable.createdAt,
    }).from(usersTable).orderBy(desc(usersTable.createdAt)).limit(5),
  ]);

  res.json({
    totalUsers: totalUsersRow.count,
    activeUsers: activeUsersRow.count,
    newUsersToday: newUsersTodayRow.count,
    totalBookings: totalBookings.count,
    confirmedBookings: confirmedBookings.count,
    pendingBookings: pendingBookings.count,
    totalReviews: totalReviews.count,
    pendingReviews: pendingReviews.count,
    activePromotions: activePromotions.count,
    totalTransactions: 0,
    totalRevenue: parseFloat(String(totalRevenueRow.total ?? "0")),
    pendingChats: Number(pendingChatsRow.count ?? 0),
    recentRegistrations,
  });
});

// ── Content CRUD ──────────────────────────────────────────────────────────────
function crudRoutes(router: Router, table: any, insertSchema: any, name: string) {
  router.get(`/${name}`, async (_req, res) => {
    res.json(await db.select().from(table) as unknown[]);
  });
  router.post(`/${name}`, async (req, res) => {
    const parsed = insertSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
    const rows = await db.insert(table).values(parsed.data).returning() as unknown[];
    res.status(201).json(rows[0]);
  });
  router.patch(`/${name}/:id`, async (req, res) => {
    const parsed = insertSchema.partial().safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
    const rows = await db.update(table).set({ ...parsed.data, updatedAt: new Date() }).where(eq(table.id, Number(req.params.id))).returning() as unknown[];
    if (!rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  });
  router.delete(`/${name}/:id`, async (req, res) => {
    await db.delete(table).where(eq(table.id, Number(req.params.id)));
    res.json({ ok: true });
  });
}

crudRoutes(router, categoriesTable, insertCategorySchema, "categories");
crudRoutes(router, clubsTable, insertClubSchema, "clubs");
crudRoutes(router, restaurantsTable, insertRestaurantSchema, "restaurants");
crudRoutes(router, toursTable, insertTourSchema, "tours");
crudRoutes(router, productsTable, insertProductSchema, "products");
crudRoutes(router, eventsTable, insertEventSchema, "events");

// ── Bookings ──────────────────────────────────────────────────────────────────
router.get("/bookings", async (_req, res) => {
  res.json(await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt)));
});

router.patch("/bookings/:id", async (req, res) => {
  const schema = z.object({ status: z.enum(["pending", "confirmed", "cancelled"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.update(bookingsTable).set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(bookingsTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users", async (_req, res) => {
  const rows = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    phone: usersTable.phone,
    role: usersTable.role,
    suspended: usersTable.suspended,
    bannedAt: usersTable.bannedAt,
    verificationStatus: usersTable.verificationStatus,
    lastLoginAt: usersTable.lastLoginAt,
    loginCount: usersTable.loginCount,
    createdAt: usersTable.createdAt,
    bookingCount: sql<number>`cast(count(distinct ${bookingsTable.id}) as int)`,
  })
    .from(usersTable)
    .leftJoin(bookingsTable, eq(bookingsTable.userId, usersTable.id))
    .groupBy(usersTable.id)
    .orderBy(desc(usersTable.createdAt));
  res.json(rows);
});

router.post("/users", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(6),
    role: z.enum(ADMIN_ROLES).default("user"),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  try {
    const [row] = await db.insert(usersTable).values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash,
      role: parsed.data.role,
    }).returning({
      id: usersTable.id, name: usersTable.name, email: usersTable.email,
      phone: usersTable.phone, role: usersTable.role, createdAt: usersTable.createdAt,
      suspended: usersTable.suspended, bannedAt: usersTable.bannedAt,
      verificationStatus: usersTable.verificationStatus, lastLoginAt: usersTable.lastLoginAt,
      loginCount: usersTable.loginCount,
    });
    res.status(201).json(row);
  } catch (err: any) {
    if (err.code === "23505") { res.status(409).json({ error: "Email already exists" }); return; }
    throw err;
  }
});

router.patch("/users/:id", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.enum(ADMIN_ROLES).optional(),
    suspended: z.boolean().optional(),
    banned: z.boolean().optional(),
    verificationStatus: z.enum(["unverified", "verified", "rejected"]).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { banned, ...rest } = parsed.data;
  const updateData: Record<string, unknown> = { ...rest, updatedAt: new Date() };

  if (banned === true) {
    updateData.bannedAt = new Date();
    updateData.suspended = true;
  } else if (banned === false) {
    updateData.bannedAt = null;
    updateData.suspended = false;
  }

  const [row] = await db.update(usersTable).set(updateData as any)
    .where(eq(usersTable.id, Number(req.params.id))).returning({
      id: usersTable.id, name: usersTable.name, email: usersTable.email,
      phone: usersTable.phone, role: usersTable.role, suspended: usersTable.suspended,
      bannedAt: usersTable.bannedAt, verificationStatus: usersTable.verificationStatus,
      lastLoginAt: usersTable.lastLoginAt, loginCount: usersTable.loginCount,
    });
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/users/:id", async (req: AuthRequest, res) => {
  const targetId = Number(req.params.id);
  if (targetId === req.userId) { res.status(400).json({ error: "Cannot delete your own account" }); return; }
  await db.delete(usersTable).where(eq(usersTable.id, targetId));
  res.json({ ok: true });
});

router.post("/users/:id/reset-password", async (req, res) => {
  const schema = z.object({ password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const [row] = await db.update(usersTable).set({ passwordHash, updatedAt: new Date() })
    .where(eq(usersTable.id, Number(req.params.id))).returning({ id: usersTable.id });
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ok: true });
});

router.get("/users/:id/bookings", async (req, res) => {
  const rows = await db.select().from(bookingsTable)
    .where(eq(bookingsTable.userId, Number(req.params.id)))
    .orderBy(desc(bookingsTable.createdAt));
  res.json(rows);
});

// ── Reviews ───────────────────────────────────────────────────────────────────
router.get("/reviews", async (_req, res) => {
  res.json(await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt)));
});

router.patch("/reviews/:id", async (req, res) => {
  const schema = z.object({ approved: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.update(reviewsTable).set(parsed.data).where(eq(reviewsTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

// ── Notifications ─────────────────────────────────────────────────────────────
router.get("/notifications", async (_req, res) => {
  res.json(await db.select().from(notificationsTable).orderBy(desc(notificationsTable.createdAt)));
});

router.post("/notifications", async (_req: AuthRequest, res) => {
  const req = _req as AuthRequest;
  const schema = z.object({
    userId: z.number().int().optional(),
    type: z.enum(["booking", "promotion", "system"]).default("system"),
    title: z.string().min(1),
    body: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.insert(notificationsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

// ── Promotions ────────────────────────────────────────────────────────────────
router.get("/promotions", async (_req, res) => {
  res.json(await db.select().from(promotionsTable).orderBy(desc(promotionsTable.createdAt)));
});

router.post("/promotions", async (req, res) => {
  const schema = z.object({
    title: z.string().min(1),
    body: z.string().optional(),
    imageUrl: z.string().optional(),
    type: z.enum(["banner", "push", "targeted"]).default("banner"),
    targetAll: z.boolean().default(true),
    active: z.boolean().default(true),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.insert(promotionsTable).values({
    ...parsed.data,
    startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined,
    endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
  }).returning();
  res.status(201).json(row);
});

router.patch("/promotions/:id", async (req, res) => {
  const schema = z.object({ active: z.boolean().optional(), title: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.update(promotionsTable).set(parsed.data).where(eq(promotionsTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/promotions/:id", async (req, res) => {
  await db.delete(promotionsTable).where(eq(promotionsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

// ── Settings ──────────────────────────────────────────────────────────────────
router.get("/settings", async (_req, res) => {
  const rows = await db.select().from(appSettingsTable);
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value;
  res.json(settings);
});

router.post("/settings", async (req, res) => {
  const schema = z.object({ key: z.string().min(1), value: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  await db.insert(appSettingsTable).values({ ...parsed.data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: appSettingsTable.key, set: { value: parsed.data.value, updatedAt: new Date() } });
  res.json({ ok: true });
});

// ── Chat ──────────────────────────────────────────────────────────────────────
router.get("/chat", async (_req, res) => {
  res.json(await db.select().from(chatMessagesTable).orderBy(chatMessagesTable.userId, chatMessagesTable.createdAt));
});

router.post("/chat/:userId/reply", async (req, res) => {
  const schema = z.object({ body: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [msg] = await db.insert(chatMessagesTable).values({
    userId: Number(req.params.userId), sender: "admin", body: parsed.data.body,
  }).returning();
  res.status(201).json(msg);
});

// ── Transactions / Payments ────────────────────────────────────────────────────
router.get("/transactions", async (_req, res) => {
  const rows = await db.select().from(transactionsTable).orderBy(desc(transactionsTable.createdAt));
  res.json(rows);
});

router.post("/transactions/:id/refund", async (req, res) => {
  const tx = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(req.params.id)));
  if (!tx[0]) { res.status(404).json({ error: "Transaction not found" }); return; }
  if (tx[0].status !== "succeeded") { res.status(400).json({ error: "Only succeeded transactions can be refunded" }); return; }
  if (!STRIPE_SECRET) { res.status(503).json({ error: "Stripe not configured" }); return; }

  const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2026-05-27.dahlia" as any });
  try {
    if (tx[0].stripePaymentIntentId) {
      await stripe.refunds.create({ payment_intent: tx[0].stripePaymentIntentId });
    }
    const [updated] = await db.update(transactionsTable)
      .set({ status: "refunded", updatedAt: new Date() })
      .where(eq(transactionsTable.id, tx[0].id))
      .returning();
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Refund failed" });
  }
});

// ── Stripe Status ──────────────────────────────────────────────────────────────
router.get("/stripe/status", async (_req, res) => {
  const configured = !!STRIPE_SECRET;
  const webhookSet = !!process.env["STRIPE_WEBHOOK_SECRET"];
  let valid = false;
  let mode: "test" | "live" | null = null;

  if (configured) {
    try {
      const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2026-05-27.dahlia" as any });
      await stripe.balance.retrieve();
      valid = true;
      mode = STRIPE_SECRET.startsWith("sk_live") ? "live" : "test";
    } catch {
      valid = false;
    }
  }

  res.json({ configured, valid, webhookSet, mode });
});

export default router;
