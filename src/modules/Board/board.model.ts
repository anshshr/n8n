import mongoose, { connections } from "mongoose";

const Schema = mongoose.Schema;

const BoardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    shapes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Shape",
      },
    ],
    connections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Connection",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const ShapeSchema = new Schema(
  {
    x: {
      type: String,
      required: true,
      min: 0,
    },
    y: {
      type: String,
      required: true,
      min: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    colour: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
      min: 0,
    },
    width: {
      type: String,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const ConnectionSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "Shape",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "Shape",
      required: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    connType: {
      type: String,
      enum: ["arrow", "line"],
      default: "arrow",
    },
  },
  {
    timestamps: true,
  },
);

export const Board = mongoose.model("Board", BoardSchema);
export const Shape = mongoose.model("Shape", ShapeSchema);
export const Connection = mongoose.model("Connection", ConnectionSchema);
