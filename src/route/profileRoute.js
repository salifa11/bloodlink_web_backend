import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
  getAllProfiles,
  updateProfileImage // Import the new controller function
} from "../controller/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerConfig.js"; // Import your Multer middleware

const router = express.Router();

// All routes require authentication
router.get("/", verifyToken, getProfile);
router.put("/update", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);
router.delete("/delete", verifyToken, deleteProfile);

// New Route: Upload Profile Image
// 'profileImage' is the key the frontend must use in FormData
router.post("/upload-image", verifyToken, upload.single('profileImage'), updateProfileImage);

// Admin route to fetch all donor profiles
router.get("/all", verifyToken, getAllProfiles);

export default router;