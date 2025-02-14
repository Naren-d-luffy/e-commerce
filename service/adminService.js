import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminValidation from "../validators/admin.validator.js";
import Admin from "../model/admin.model.js"

const createAdmin = async (adminData) => {
  const { error } = adminValidation.validate(adminData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = new Admin({
      ...adminData,
      password: hashedPassword,
      status: adminData.status || "ACTIVE",
    });

    return await admin.save();
  } catch (error) {
    throw new Error(`Error Creating Admin: ${error.message}`);
  }
};

const getAllAdmin = async () => {
  try {
    return await Admin.find();
  } catch (error) {
    throw new Error(`Error Fetching Admins: ${error.message}`);
  }
};

const getAdminById = async (id) => {
  try {
    const admin = await Admin.findById(id);
    if (!admin) throw new Error("Admin not found.");
    return admin;
  } catch (error) {
    throw new Error(`Error Fetching Admin: ${error.message}`);
  }
};

const validateUser = async (email, password) => {
  const user = await Admin.findOne({ email });
  if (!user) throw new Error("User Not Found");

  if (user.status === "INACTIVE") {
    throw new Error("Account Inactive. Contact Admin.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid Password");

  const payload = { id: user.id, status: user.status };
  const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  const { password: _, ...safeUserData } = user.toObject();
  return { accessToken, refreshToken, user: safeUserData };
};

export default { createAdmin, getAllAdmin, getAdminById, validateUser };
