import { Router } from "express";
import {
  getMeController,
  loginController,
  logoutController,
  refreshController,
  registerController,
  updateRoleController,
} from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import rbacMiddleware from "../../middlewares/rbac.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", authMiddleware, logoutController);
router.get("/me", authMiddleware, getMeController);
router.patch(
  "/:userId/role",
  authMiddleware,
  rbacMiddleware(["*"]),
  updateRoleController,
);

export default router;
