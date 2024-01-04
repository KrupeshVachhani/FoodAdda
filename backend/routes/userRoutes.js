import express from "express";
import { userRegister, getAdminUsers , loginUser } from "../controllers/userController.js";
// import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(loginUser);
router.route("/admin/:name").get(getAdminUsers);

export default router;
