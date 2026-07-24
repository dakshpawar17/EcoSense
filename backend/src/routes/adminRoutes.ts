import { Router } from "express";
import { getAdminAnalytics } from "../controllers/adminController";

const router = Router();

router.get("/analytics", getAdminAnalytics);

export default router;
