import express from "express";
import { createAdmin, getAdmins,getAdminById,loginAdmin } from "../../controller/adminController.js";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createAdmin);
router.get("/", isAdmin, getAdmins);
router.get("/:id", isAdmin, getAdminById);
router.post("/login", loginAdmin);

export default router;
