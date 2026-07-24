import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/profileController";

const router = Router();

router.get("/", getUserProfile);
router.put("/", updateUserProfile);

export default router;
