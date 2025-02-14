import express from "express";
import { sendOTP, verifyOTP } from "../../controller/otpController";

const router = express.Router();

router.post("/", sendOTP);
router.post("/verify", verifyOTP);
 
export default router;
