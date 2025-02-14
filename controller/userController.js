import userService from "../service/userService.js";

export const createUserController = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error Creating User", message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Users", message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    res.status(500).json({ error: "Error Fetching User by ID", message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await userService.validateUser(email, password);
    res.status(200).json({ message: "Login Successful", accessToken, refreshToken, user });
  } catch (error) {
    res.status(401).json({ error: "Invalid Email or Password", message: error.message });
  }
};
