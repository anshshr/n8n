import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.types.js";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
  updateRole,
} from "./auth.service.js";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
  updateRoleSchema,
} from "./auth.validation.js";

export async function registerController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await register(payload.name, payload.email, payload.password);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await login(payload.email, payload.password);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function refreshController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = refreshSchema.parse(req.body);
    const result = await refresh(payload.refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function logoutController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await logout(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMeController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await getMe(req.user!.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateRoleController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = updateRoleSchema.parse(req.body);
    const userId = req.params.userId;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({
        message: "Valid userId param is required",
      });
    }

    const result = await updateRole(userId, payload.role);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
