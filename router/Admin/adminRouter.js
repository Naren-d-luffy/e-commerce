import express from "express";
import { createAdmin, getAdmins,getAdminById,loginAdmin,changeStatus,deleteAdmin } from "../../controller/adminController.js";
import {verifyToken, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",  createAdmin);
router.get("/",verifyToken,isAdmin, getAdmins);
router.get("/:id",verifyToken,isAdmin, getAdminById);
router.post("/login", loginAdmin);
router.patch("/status",verifyToken,isAdmin, changeStatus);
router.delete("/:adminId",verifyToken,isAdmin, deleteAdmin);

export default router;
