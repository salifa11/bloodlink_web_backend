import express from "express";
import { login, register, getProfile, deleteUser, forgotPassword, resetPassword, updateProfile, updateProfileImage } from "../controller/authController.js"; // Added updateProfile and updateProfileImage
import { verifyToken } from "../middleware/authMiddleware.js"; // Added verifyToken
import upload from "../middleware/multerConfig.js"; // Import Multer for file uploads

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);
// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected route: Dashboard calls this to fill the white box
router.get("/profile", verifyToken, getProfile);

// Protected route: Update user profile
router.put("/update", verifyToken, updateProfile);

// Protected route: Upload profile image
router.post("/upload-image", verifyToken, upload.single('profileImage'), updateProfileImage);

// Admin route: Delete user by ID
router.delete("/user/:userId", verifyToken, deleteUser);

export default router;