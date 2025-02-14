import express from "express";
import { createAdmin, getAdmins,getAdminById,loginAdmin } from "../../controller/adminController.js";
import { verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",  createAdmin);
router.get("/", getAdmins);
router.get("/:id", getAdminById);
router.post("/login", loginAdmin);

export default router;
