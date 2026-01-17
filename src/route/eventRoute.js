import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controller/eventController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerConfig.js";

const router = express.Router();

router.post("/create", verifyToken, upload.single('eventImage'), createEvent);
router.get("/all", getAllEvents);
// New route for event details
router.get("/:id", getEventById); 

export default router;