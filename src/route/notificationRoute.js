import express from "express";
import { getMyNotifications, markAllRead, requestBlood, notifySpecificDonor } from "../controller/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getMyNotifications);
router.put("/mark-read", verifyToken, markAllRead);
router.post("/request-blood", verifyToken, requestBlood);
router.post("/notify-donor", verifyToken, notifySpecificDonor); // ← ADD THIS

export default router;