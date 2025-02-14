import otpGenerator from "otp-generator";
import OTPModel from "../model/otp.model.js";
import User from "../model/user.model.js";
import { sendOTPEmail } from "../utils/emailSender.js";

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // const lastOTP = await OTPModel.findOne({ email }).sort({ createdAt: -1 });
  // if (lastOTP && lastOTP.expiresAt > Date.now() - 60000) {
  //   return res.status(429).json({ message: "Wait 1 minute before requesting another OTP" });
  // }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await OTPModel.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
console.log(otp);

    res.status(202).json({ message: "OTP is being sent..." });

    setTimeout(async () => {
      try {
        await sendOTPEmail(email, otp);
        console.log(`OTP email sent to ${email}`);
      } catch (error) {
        console.error(`Failed to send OTP: ${error.message}`);
      }
    }, 0); // Async execution

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const validOTP = await OTPModel.findOne({ email, otp });

  if (!validOTP || validOTP.expiresAt < Date.now())
    return res.status(400).json({ message: "Invalid OTP" });

  await User.updateOne({ email }, { verified: true });
  res.status(201).json({ message: "OTP Verified" });
};
