import { z } from "zod";
import { ROLES } from "./auth.types.js";

const passwordRule =
  /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.email("Please provide a valid email"),
  password: z
    .string()
    .regex(
      passwordRule,
      "Password must be at least 8 characters and include 1 uppercase letter and 1 number",
    ),
});

export const loginSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const updateRoleSchema = z.object({
  role: z.enum(ROLES),
});
