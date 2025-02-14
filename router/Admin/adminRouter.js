import express from "express";
import { createAdminController, getAdmins,getAdminById,loginAdmin } from "../../controller/adminController.js";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createAdminController);
router.get("/", isAdmin, getAdmins);
router.get("/:id", isAdmin, getAdminById);
router.post("/login", loginAdmin);

export default router;
