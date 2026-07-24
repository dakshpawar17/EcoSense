import { Router } from "express";
import { generateReport } from "../controllers/reportController";

const router = Router();

router.post("/", generateReport);

export default router;
