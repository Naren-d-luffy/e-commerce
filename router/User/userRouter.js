import express from "express";
import { createUserController, getUsers, getUserById, loginUser } from "../../controller/adminController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUserController);
router.post("/login", loginUser);

export default router;
