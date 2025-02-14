import otpGenerator from "otp-generator";
import OTPModel from "../models/otp.model.js";
import User from "../models/user.model.js";

export const sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    await OTPModel.create({ email, otp, expiresAt: Date.now() + process.env.OTP_EXPIRY });
    res.status(200).json({ message: "OTP Sent" });
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const validOTP = await OTPModel.findOne({ email, otp });

    if (!validOTP || validOTP.expiresAt < Date.now()) return res.status(400).json({ message: "Invalid OTP" });

    await User.updateOne({ email }, { verified: true });
    res.status(201).json({ message: "OTP Verified" });
};
