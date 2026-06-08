import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "@workspace/db";
import { chatMessagesTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { z } from "zod";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const rows = await db.select().from(chatMessagesTable)
    .where(eq(chatMessagesTable.userId, req.userId!))
    .orderBy(chatMessagesTable.createdAt)
    .limit(100);
  res.json(rows);
});

router.post("/", async (req: AuthRequest, res) => {
  const schema = z.object({ body: z.string().min(1).max(2000) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [msg] = await db.insert(chatMessagesTable).values({
    userId: req.userId!, sender: "user", body: parsed.data.body,
  }).returning();
  res.status(201).json(msg);
});

export default router;
