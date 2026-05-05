import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { createBoard, getBoards } from "./board.service.js";

const createBoardSchema = z.object({
  name: z.string().trim().min(1, "Board name is required"),
  desc: z.string().trim().optional().default(""),
});

export async function createBoardController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = createBoardSchema.parse(req.body);
    const board = await createBoard(payload.name, payload.desc);

    return res.status(201).json({
      message: "Board created successfully",
      board,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBoardsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const boards = await getBoards();

    return res.status(200).json({
      boards,
    });
  } catch (error) {
    next(error);
  }
}
