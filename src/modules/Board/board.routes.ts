import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import rbacMiddleware from "../../middlewares/rbac.middleware.js";
import {
  createBoardController,
  getBoardsController,
} from "./board.controller.js";

const router = Router();

router.get("/", authMiddleware, rbacMiddleware(["board:read"]), getBoardsController);
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(["board:create"]),
  createBoardController,
);

export default router;
