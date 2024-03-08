import express from "express";
import {
  userRegister,
  getAdminUsers,
  loginUser,
  logoutUser,
  userDetails
} from "../controllers/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(loginUser);
router.route("/me").get( userDetails);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/admin/:pass").get(getAdminUsers);

export default router;
