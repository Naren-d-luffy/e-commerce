import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import userValidation from "../validators/user.validator.js";

const createUser = async (userData) => {
  const { error } = userValidation.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    userData.status = userData.status || "ACTIVE";

    return await User.create(userData);
  } catch (error) {
    throw new Error(`Error Creating User: ${error.message}`);
  }
};

const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error(`Error Fetching Users: ${error.message}`);
  }
};

const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error(`Error Fetching User by ID: ${error.message}`);
  }
};

const validateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User Not Found");

  if (user.status === "INACTIVE") {
    throw new Error("Account Inactive, please contact the Administrator.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid Password");

  const accessToken = jwt.sign(
    { id: user.id, status: user.status },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, status: user.status },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUserData } = user.toObject();

  return { accessToken, refreshToken, user: safeUserData };
};

export default { createUser, getAllUsers, getUserById, validateUser };
