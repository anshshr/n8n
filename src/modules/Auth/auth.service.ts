import AppError from "../../Error/appError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { User } from "./auth.model.js";
import type { Role } from "./auth.types.js";

function sanitizeUser(user: {
  _id: unknown;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function register(name: string, email: string, password: string) {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "viewer",
  });

  return {
    message: "User registered successfully",
    user: sanitizeUser(user),
  };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokenPayload = {
    userId: String(user._id),
    role: user.role as Role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  if (!user.refreshToken || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = generateAccessToken({
    userId: String(user._id),
    role: user.role as Role,
  });

  return { accessToken };
}

export async function logout(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.refreshToken = null;
  await user.save();

  return {
    message: "User logged out successfully",
  };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    user: sanitizeUser(user),
  };
}

export async function updateRole(userId: string, role: Role) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.role = role;
  user.refreshToken = null;
  await user.save();

  return {
    message: "User role updated successfully",
    user: sanitizeUser(user),
  };
}
