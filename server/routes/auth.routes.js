import { Router } from "express";
import { registerController, loginController } from "../auth/auth.js";

const router = Router();
router.post("/register", registerController);
router.post("/login", loginController);

export default router;
