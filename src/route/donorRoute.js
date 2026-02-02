import express from "express";
import { 
    registerDonor, 
    getAllDonors, 
    updateDonorStatus, 
    getAvailableDonors,
    getDonorByUserId
} from "../controller/donorController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Routes
router.post("/register", verifyToken, registerDonor);
router.get("/available", verifyToken, getAvailableDonors);
router.get("/my-profile", verifyToken, getDonorByUserId);

// Admin Routes
router.get("/admin/all", verifyToken, getAllDonors);
router.put("/status/:id", verifyToken, updateDonorStatus);

export default router;