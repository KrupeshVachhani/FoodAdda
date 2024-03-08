import express from "express";
import {
  createOrder,
  getOrdersForUser,
  getOrdersForAdmin,
} from "../controllers/orderController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST request to create a new order
router.post("/postorder", createOrder);

// GET request to fetch all orders for a specific user
router.get("/user/:userId", verifyJWT, getOrdersForUser);
router.get("/admin/:pass", getOrdersForAdmin);

export default router;
