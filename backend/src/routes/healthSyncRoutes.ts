import { Router } from "express";
import { syncHealthData, saveGPSTrip, syncWeeklyHealthAnalysis } from "../controllers/healthSyncController";

const router = Router();

router.post("/health", syncHealthData);
router.post("/gps", saveGPSTrip);
router.post("/weekly", syncWeeklyHealthAnalysis);

export default router;
