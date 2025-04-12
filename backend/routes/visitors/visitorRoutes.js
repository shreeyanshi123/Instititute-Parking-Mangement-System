import express from "express";
import { bookVisitorSlot,confirmVisitorSlot,getReservedSlots, getReservedVisitorCount, unreserveVisitorSlot } from "../../controllers/visitor/visitor-controller.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";
const router = express.Router();

router.post("/bookSlot",authMiddleware,bookVisitorSlot);
router.post("/confirmSlot",confirmVisitorSlot);
router.get("/getCount",authMiddleware,getReservedVisitorCount);
router.get("/getReservedSlots",authMiddleware,getReservedSlots);
router.post("/unreserveSlot",authMiddleware,unreserveVisitorSlot)

export default router;
