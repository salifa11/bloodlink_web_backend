// eventRoutes.js
import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  updateEvent
} from "../controller/eventController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerConfig.js"; // ✅ Fixed this line

const router = express.Router();

// CREATE EVENT (Admin only)
router.post("/create", verifyToken, upload.single("eventImage"), createEvent);

// GET ALL EVENTS (Public)
router.get("/", getAllEvents);

// GET SINGLE EVENT (Public)
router.get("/:id", getEventById);

// DELETE EVENT (Admin only)
router.delete("/:id", verifyToken, deleteEvent);

export default router;