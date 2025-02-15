import Product from "../model/product.model.js";
// import User from "../models/User.js";
import productValidation from "../validators/product.validator.js";

export const createProduct = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;

    if (!["vendor", "staff", "admin"].includes(role)) {
      return res
        .status(403)
        .json({
          message:
            "Unauthorized: Only vendors, staff, and admins can create products",
        });
    }

    const { error } = productValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((err) => err.message) });
    }
    
    const { scheduledStartDate } = req.body;

    if (!scheduledStartDate || isNaN(new Date(scheduledStartDate))) {
      return res.status(400).json({ message: "Invalid scheduledStartDate" });
    }

    const expiryDate = new Date(scheduledStartDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

    const newProduct = new Product({
      ...req.body,
      expiryDate: expiryDate,
      createdBy: userId,
      vendorId: userId,
    });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
    try {
      let { page, limit } = req.query;
  
      page = parseInt(page, 10) || 1; 
      limit = parseInt(limit, 10) || 10; 
  
      if (page < 1 || limit < 1) {
        return res.status(400).json({ message: "Invalid pagination parameters" });
      }
  
      const totalProducts = await Product.countDocuments({ isDeleted: false });
      const totalPages = Math.ceil(totalProducts / limit);
  
      const products = await Product.find({ isDeleted: false })
        .populate("vendorId", "name email")
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.status(200).json({
        totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
        products,
      });
  
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };  

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    }).populate("vendorId", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { role, _id: userId } = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (role === "vendor") {
      if (!product.vendorId || product.vendorId.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "Unauthorized: You can only update your own products",
        });
      }
    } else if (!["admin", "staff"].includes(role)) {
      return res.status(403).json({
        message: "Unauthorized: Only vendor, staff, or admin can update products",
      });
    }

    const { error } = productValidation.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }

    let updateData = { ...req.body };
    if (req.body.scheduledStartDate) {
      const scheduledStartDate = new Date(req.body.scheduledStartDate);
      if (isNaN(scheduledStartDate)) {
        return res.status(400).json({ message: "Invalid scheduledStartDate" });
      }
      updateData.expiryDate = new Date(scheduledStartDate);
      updateData.expiryDate.setDate(updateData.expiryDate.getDate() + 7);
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const softDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { role, _id: userId } = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      role === "vendor" &&
      product.vendorId.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: You can only delete your own products",
        });
    }

    await Product.findByIdAndUpdate(productId, { isDeleted: true });

    res
      .status(200)
      .json({ message: "Product marked as deleted (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteProductPermanently = async (req, res) => {
  try {
    const { productId } = req.params;
    const { role } = req.user;

    if (!["admin", "staff"].includes(role)) {
      return res
        .status(403)
        .json({
          message:
            "Unauthorized: Only Admin and Staff can delete products permanently",
        });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      const newReview = { user: userId, rating, comment };

      product.ratings.reviews.push(newReview);
      product.ratings.totalReviews = product.ratings.reviews.length;
      product.ratings.average =
          product.ratings.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.ratings.totalReviews;

      await product.save();

      res.status(201).json({ message: "Review added successfully", product });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
