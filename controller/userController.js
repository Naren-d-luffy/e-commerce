import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!["user", "vendor"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use, try with another Email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role, verified: false });

        res.status(201).json({ message: "User Created Successfully, But verify before login" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        if (!user.verified) {
            return res.status(403).json({ message: "Account not verified. Verify OTP first." });
        }

         const payload = { id: user.id, status: user.status, role: user.role };
         const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "15m" });
         const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });

         const { password: _, ...safeUserData } = user.toObject();

        res.status(200).json({ message: "Login Successful", accessToken, refreshToken, user: safeUserData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
