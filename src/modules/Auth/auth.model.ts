import mongoose from "mongoose";
import { ROLES } from "./auth.types.js";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "viewer",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const RolesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    modules: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: {
      type: [String],
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const RoleModel = mongoose.model("Role", RolesSchema);
export const UserModel = mongoose.model("User", UserSchema);
