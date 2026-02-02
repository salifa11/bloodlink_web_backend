import express from "express";
import { login, register, getProfile, deleteUser } from "../controller/authController.js"; // Added deleteUser
import { verifyToken } from "../middleware/authMiddleware.js"; // Added verifyToken

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected route: Dashboard calls this to fill the white box
router.get("/profile", verifyToken, getProfile);

// Admin route: Delete user by ID
router.delete("/user/:userId", verifyToken, deleteUser);

export default router;