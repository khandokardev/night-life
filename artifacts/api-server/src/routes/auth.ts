import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq, or, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable, refreshTokensTable, registerSchema, loginSchema } from "@workspace/db/schema";
import { signAccessToken, signRefreshToken, verifyRefreshToken, refreshExpiresAt } from "../lib/jwt.js";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, phone, name, password } = parsed.data;
  if (!email && !phone) {
    res.status(400).json({ error: "Email or phone required" });
    return;
  }
  try {
    const existing = await db.select().from(usersTable).where(
      or(email ? eq(usersTable.email, email) : undefined, phone ? eq(usersTable.phone, phone) : undefined)
    ).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Account already exists" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const [user] = await db.insert(usersTable).values({
      email, phone, name, passwordHash, lastLoginAt: now, loginCount: 1,
    }).returning();
    const payload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await db.insert(refreshTokensTable).values({ userId: user.id, token: refreshToken, expiresAt: refreshExpiresAt() });
    res.status(201).json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    req.log.error(err, "register error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, phone, password } = parsed.data;
  if (!email && !phone) {
    res.status(400).json({ error: "Email or phone required" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(
      email ? eq(usersTable.email, email) : eq(usersTable.phone, phone!)
    ).limit(1);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (user.bannedAt) {
      res.status(403).json({ error: "Account has been banned. Contact support." });
      return;
    }
    if (user.suspended) {
      res.status(403).json({ error: "Account is suspended. Contact support." });
      return;
    }
    await db.update(usersTable).set({
      lastLoginAt: new Date(),
      loginCount: sql`${usersTable.loginCount} + 1`,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    const payload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await db.insert(refreshTokensTable).values({ userId: user.id, token: refreshToken, expiresAt: refreshExpiresAt() });
    res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    req.log.error(err, "login error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    res.status(400).json({ error: "refreshToken required" });
    return;
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    const [stored] = await db.select().from(refreshTokensTable).where(eq(refreshTokensTable.token, refreshToken)).limit(1);
    if (!stored || stored.expiresAt < new Date()) {
      res.status(401).json({ error: "Invalid or expired refresh token" });
      return;
    }
    const newAccess = signAccessToken({ userId: payload.userId, role: payload.role });
    res.json({ accessToken: newAccess });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, refreshToken));
  }
  res.json({ ok: true });
});

router.post("/otp/send", async (req, res) => {
  const { phone, email } = req.body as { phone?: string; email?: string };
  if (!phone && !email) {
    res.status(400).json({ error: "phone or email required" });
    return;
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  req.log.info({ otp, phone, email }, "OTP generated (Firebase integration pending)");
  res.json({ ok: true, message: "OTP sent (Firebase integration pending)" });
});

router.post("/otp/verify", async (_req, res) => {
  res.json({ ok: true, message: "OTP verification — Firebase integration pending" });
});

export default router;
