// salifa11/bloodlink_web_backend/src/route/donorRoute.js
import express from "express";
import { registerDonor } from "../controller/donorController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// This route handles the POST request from your "Register as Donor" button
router.post("/register", verifyToken, registerDonor);

export default router;