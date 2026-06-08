import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env["JWT_SECRET"] ?? "sa-plug-access-secret";
const REFRESH_SECRET = process.env["JWT_REFRESH_SECRET"] ?? "sa-plug-refresh-secret";
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "30d";

export interface JwtPayload {
  userId: number;
  role: string;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export function refreshExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
}
