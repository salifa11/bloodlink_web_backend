import express from "express";
import { applyToEvent } from "../controller/applicationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/apply", verifyToken, applyToEvent);

export default router;