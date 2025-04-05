import express from "express";
import { getSlots,getAllLocations,bookSlot } from "../../controllers/user/user-controller.js";
const router = express.Router();

router.get("/getSlots/:location_id", getSlots);
router.get("/getAllLocations", getAllLocations);
router.post("/bookSlot", bookSlot);

export default router;
