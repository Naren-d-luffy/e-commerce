import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  deleteProductPermanently,
} from "../../controller/productController.js";
import authenticate from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createProduct); 
router.get("/", authenticate, getAllProducts); 
router.get("/:productId", authenticate, getProductById); 
router.put("/:productId", authenticate, updateProduct);
router.patch("/soft-delete/:productId", authenticate, softDeleteProduct);
router.delete("/:productId", authenticate, deleteProductPermanently);

export default router;
