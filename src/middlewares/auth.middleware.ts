import type { NextFunction, Response } from "express";
import AppError from "../Error/appError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import type { AuthenticatedRequest } from "../modules/Auth/auth.types.js";

export default function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new AppError("Authorization header is missing", 401);
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header format", 401);
    }

    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
