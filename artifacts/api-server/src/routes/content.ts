import { Router } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  categoriesTable, clubsTable, restaurantsTable, toursTable, productsTable, eventsTable,
} from "@workspace/db/schema";

const router = Router();

function buildFilters(table: any, q?: string) {
  if (!q) return undefined;
  return or(ilike(table.name, `%${q}%`), ilike(table.description, `%${q}%`));
}

router.get("/categories", async (req, res) => {
  const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.active, true)).orderBy(categoriesTable.order);
  res.json(rows);
});

router.get("/clubs", async (req, res) => {
  const { q, trending, featured } = req.query as Record<string, string | undefined>;
  let query = db.select().from(clubsTable).where(eq(clubsTable.available, true)).$dynamic();
  if (trending === "1") query = query.where(eq(clubsTable.isTrending, true));
  if (featured === "1") query = query.where(eq(clubsTable.isFeatured, true));
  const rows = await query;
  const filtered = q ? rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())) : rows;
  res.json(filtered);
});

router.get("/clubs/:id", async (req, res) => {
  const [row] = await db.select().from(clubsTable).where(eq(clubsTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.get("/restaurants", async (req, res) => {
  const { q, trending, featured } = req.query as Record<string, string | undefined>;
  let query = db.select().from(restaurantsTable).where(eq(restaurantsTable.available, true)).$dynamic();
  if (trending === "1") query = query.where(eq(restaurantsTable.isTrending, true));
  if (featured === "1") query = query.where(eq(restaurantsTable.isFeatured, true));
  const rows = await query;
  const filtered = q ? rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())) : rows;
  res.json(filtered);
});

router.get("/restaurants/:id", async (req, res) => {
  const [row] = await db.select().from(restaurantsTable).where(eq(restaurantsTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.get("/tours", async (req, res) => {
  const { q, trending, featured } = req.query as Record<string, string | undefined>;
  let query = db.select().from(toursTable).where(eq(toursTable.available, true)).$dynamic();
  if (trending === "1") query = query.where(eq(toursTable.isTrending, true));
  if (featured === "1") query = query.where(eq(toursTable.isFeatured, true));
  const rows = await query;
  const filtered = q ? rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())) : rows;
  res.json(filtered);
});

router.get("/tours/:id", async (req, res) => {
  const [row] = await db.select().from(toursTable).where(eq(toursTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.get("/products", async (req, res) => {
  const { q, trending, featured } = req.query as Record<string, string | undefined>;
  let query = db.select().from(productsTable).where(eq(productsTable.available, true)).$dynamic();
  if (trending === "1") query = query.where(eq(productsTable.isTrending, true));
  if (featured === "1") query = query.where(eq(productsTable.isFeatured, true));
  const rows = await query;
  const filtered = q ? rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())) : rows;
  res.json(filtered);
});

router.get("/products/:id", async (req, res) => {
  const [row] = await db.select().from(productsTable).where(eq(productsTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.get("/events", async (req, res) => {
  const { q, trending, featured } = req.query as Record<string, string | undefined>;
  let query = db.select().from(eventsTable).where(eq(eventsTable.available, true)).$dynamic();
  if (trending === "1") query = query.where(eq(eventsTable.isTrending, true));
  if (featured === "1") query = query.where(eq(eventsTable.isFeatured, true));
  const rows = await query;
  const filtered = q ? rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())) : rows;
  res.json(filtered);
});

router.get("/events/:id", async (req, res) => {
  const [row] = await db.select().from(eventsTable).where(eq(eventsTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

export default router;
