import { Router } from "express";
import { loginOrRegisterUser, getCurrentUser } from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// POST /api/auth/login
router.post("/login", loginOrRegisterUser);

// GET /api/auth/me
router.get("/me", authenticateUser, getCurrentUser);

export default router;
