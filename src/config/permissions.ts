import type { Permission, Role } from "../modules/Auth/auth.types.js";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  superadmin: ["*"],
  admin: ["board:create", "board:read", "board:update", "board:delete"],
  editor: ["board:create", "board:read", "board:update"],
  viewer: ["board:read"],
};
