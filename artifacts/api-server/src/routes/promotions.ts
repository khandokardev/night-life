import { Router } from "express";
import { and, eq, lte, gte, or, isNull } from "drizzle-orm";
import { db } from "@workspace/db";
import { promotionsTable } from "@workspace/db/schema";

const router = Router();

router.get("/", async (_req, res) => {
  const now = new Date();
  const rows = await db.select().from(promotionsTable).where(
    and(
      eq(promotionsTable.active, true),
      or(isNull(promotionsTable.startsAt), lte(promotionsTable.startsAt, now)),
      or(isNull(promotionsTable.endsAt), gte(promotionsTable.endsAt, now))
    )
  );
  res.json(rows);
});

export default router;
