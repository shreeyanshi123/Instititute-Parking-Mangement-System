import express from "express";
import { getSlots,getAllLocations,bookSlot, getUserBookings } from "../../controllers/user/user-controller.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";
const router = express.Router();

router.get("/getSlots/:location_id", getSlots);
router.get("/getAllLocations",authMiddleware, getAllLocations);
router.post("/bookSlot", bookSlot);
router.get("/bookings", authMiddleware, getUserBookings);

export default router;
