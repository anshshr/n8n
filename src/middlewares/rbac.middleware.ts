import type { NextFunction, Response } from "express";
import { ROLE_PERMISSIONS } from "../config/permissions.js";
import AppError from "../Error/appError.js";
import type {
  AuthenticatedRequest,
  Permission,
} from "../modules/Auth/auth.types.js";

export default function rbacMiddleware(requiredPermissions: Permission[]) {
  return function (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const userPermissions = ROLE_PERMISSIONS[req.user.role];

      const hasPermission =
        userPermissions.includes("*") ||
        requiredPermissions.every((permission) =>
          userPermissions.includes(permission),
        );

      if (!hasPermission) {
        throw new AppError("Forbidden", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
