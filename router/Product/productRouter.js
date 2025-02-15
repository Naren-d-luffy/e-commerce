import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  deleteProductPermanently,
} from "../../controller/productController.js";
import {verifyToken} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createProduct); 
router.get("/", verifyToken, getAllProducts); 
router.get("/:productId", verifyToken, getProductById); 
router.put("/:productId", verifyToken, updateProduct);
router.patch("/soft-delete/:productId", verifyToken, softDeleteProduct);
router.delete("/:productId", verifyToken, deleteProductPermanently);

export default router;
