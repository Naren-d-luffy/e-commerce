import express from "express";
import { registerUser, loginUser, getProfile,updateStatus, deleteVendor } from "../../controller/userController.js";
import {verifyToken, isAdmin} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile",verifyToken, getProfile);
router.patch("/:userId",verifyToken,isAdmin, updateStatus);
router.delete("/:vendorId",verifyToken,isAdmin, deleteVendor);


export default router;
