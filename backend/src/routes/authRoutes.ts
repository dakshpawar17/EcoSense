import { Router } from "express";
import { loginOrRegisterUser } from "../controllers/authController";

const router = Router();

// POST /api/auth/login
router.post("/login", loginOrRegisterUser);

export default router;
