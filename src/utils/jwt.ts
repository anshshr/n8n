import jwt, { type SignOptions } from "jsonwebtoken";
import { appConfig } from "../config/env.js";
import type { Role } from "../modules/Auth/auth.types.js";

export interface JwtPayload {
  userId: string;
  role: Role;
}

function getExpiry(value: string): NonNullable<SignOptions["expiresIn"]> {
  return value as NonNullable<SignOptions["expiresIn"]>;
}

export function generateAccessToken(payload: JwtPayload) {
  const expiresIn = getExpiry(appConfig.ACCESS_TOKEN_EXPIRES_IN);

  return jwt.sign(payload, appConfig.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });
}

export function generateRefreshToken(payload: JwtPayload) {
  const expiresIn = getExpiry(appConfig.REFRESH_TOKEN_EXPIRES_IN);

  return jwt.sign(payload, appConfig.REFRESH_TOKEN_SECRET, {
    expiresIn,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, appConfig.ACCESS_TOKEN_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, appConfig.REFRESH_TOKEN_SECRET) as JwtPayload;
}
