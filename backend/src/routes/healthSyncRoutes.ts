import { Router } from "express";
import { syncHealthData, saveGPSTrip } from "../controllers/healthSyncController";

const router = Router();

router.post("/health", syncHealthData);
router.post("/gps", saveGPSTrip);

export default router;
