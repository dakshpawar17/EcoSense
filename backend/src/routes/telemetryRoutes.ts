import { Router } from "express";
import { predictTransportMode, submitUserCorrection, getMultiTimeframeSummary } from "../controllers/telemetryController";

const router = Router();

router.post("/predict-mode", predictTransportMode);
router.post("/correct-mode", submitUserCorrection);
router.get("/summaries", getMultiTimeframeSummary);

export default router;
