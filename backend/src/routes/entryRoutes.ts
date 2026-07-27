import { Router } from "express";
import { createEntry, syncEntries, getEntries, getEntryById, deleteEntry } from "../controllers/entryController";

const router = Router();

router.post("/", createEntry);
router.post("/sync", syncEntries);
router.get("/", getEntries);
router.get("/:id", getEntryById);
router.delete("/:id", deleteEntry);

export default router;
