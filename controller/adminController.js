import adminService from "../service/adminService.js"; 

export const createAdminController = async (req, res) => {
  try {
    const adminData = req.body;
    if (!["admin"].includes(adminData.role)) return res.status(400).json({ message: "Invalid Role" });
    
    const newAdmin = await adminService.createAdmin(adminData);
    res.status(201).json({ message: "Admin created successfully", data: newAdmin });
  } catch (error) {
    res.status(500).json({ error: "Error Creating Admin", message: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmin();
    if (!admins.length) {
      return res.status(404).json({ message: "No admins found" });
    }
    res.status(200).json({ message: "Admins fetched successfully", data: admins });
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Admins", message: error.message });
  }
};

export const getAdminById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  try {
    const admin = await adminService.getAdminById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin fetched successfully", data: admin });
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Admin by ID", message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, admin } = await adminService.validateAdmin(email, password);
    res.status(200).json({ message: "Login Successful", accessToken, refreshToken, admin });
  } catch (error) {
    res.status(401).json({ error: "Invalid Email or Password", message: error.message });
  }
};
