import mongoose from "mongoose";
import { sendOTPEmail } from "../utils/emailSender.js";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

otpSchema.pre("save", async function (next) {
    try {
        await sendOTPEmail(this.email, this.otp); // Call email function
        next();
    } catch (error) {
        next(error); // Pass error to Mongoose
    }
});

export default mongoose.model("OTP", otpSchema);
