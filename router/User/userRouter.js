import express from "express";
import { registerUser, loginUser, getProfile } from "../../controller/userController.js";
import {verifyToken} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile",verifyToken, getProfile);

export default router;
