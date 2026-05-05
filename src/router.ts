import { Router } from "express";
import authRoutes from "./modules/Auth/auth.routes.js";
import boardRoutes from "./modules/Board/board.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/boards", boardRoutes);

export default router;
