import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";
import AppError from "../Error/appError.js";
import { MongooseError } from "mongoose";

export default async function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // zod error
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      })),
    });
  }

  // normal error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // mongoDB error
  if (err instanceof MongooseError) {
    return res.status(500).json({
      message: "Database Error",
      error: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
}
