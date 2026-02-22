import express from "express";
import { applyToEvent, getAllApplications, updateStatus, getUserHistory } from "../controller/applicationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route for users to apply (requires login token)
router.post("/apply", verifyToken, applyToEvent);

// Route for admin to view all applications
router.get("/all", getAllApplications);

// Route for user to view their own history
router.get("/history", verifyToken, getUserHistory);

// NEW: Route to handle the Tick and Cross actions
router.put("/status/:id", verifyToken, updateStatus);
export default router;