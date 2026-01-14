import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile
} from "../controller/profileController.js";
// Import verifyToken instead of authMiddleware
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication - use verifyToken
router.get("/", verifyToken, getProfile);
router.put("/update", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);
router.delete("/delete", verifyToken, deleteProfile);

export default router;