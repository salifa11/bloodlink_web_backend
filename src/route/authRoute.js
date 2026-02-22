import express from "express";
import { login, register, getProfile, deleteUser, forgotPassword, resetPassword } from "../controller/authController.js"; // Added forgot/reset
import { verifyToken } from "../middleware/authMiddleware.js"; // Added verifyToken

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);
// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected route: Dashboard calls this to fill the white box
router.get("/profile", verifyToken, getProfile);

// Admin route: Delete user by ID
router.delete("/user/:userId", verifyToken, deleteUser);

export default router;