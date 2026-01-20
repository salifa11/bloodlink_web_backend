import express from "express";
import { login, register, getProfile } from "../controller/authController.js"; // Added getProfile
import { verifyToken } from "../middleware/authMiddleware.js"; // Added verifyToken

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected route: Dashboard calls this to fill the white box
router.get("/profile", verifyToken, getProfile);

export default router;