import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import userValidation from "../validators/user.validator.js";

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!["user", "vendor"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const { error } = userValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
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

export const updateStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User/Vendor not found" });
        }

        user.status = status;
        await user.save();

        res.status(200).json({ message: `Status updated to ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVendor = async (req, res) => {
    const { vendorId } = req.params;

    try {
        const vendor = await User.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.role !== "vendor") {
            return res.status(400).json({ message: "Only vendors can be deleted" });
        }

        await User.findByIdAndDelete(vendorId);
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
