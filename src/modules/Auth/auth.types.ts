import type { Request } from "express";

export const ROLES = ["superadmin", "admin", "editor", "viewer"] as const;

export type Role = (typeof ROLES)[number];

export type Permission =
  | "*"
  | "board:create"
  | "board:read"
  | "board:update"
  | "board:delete";

export interface AuthUser {
  userId: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
