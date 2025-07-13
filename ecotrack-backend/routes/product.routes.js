const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAdminProducts,
  getScannedProductByName,
  updateUserImpact,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product"); // ✅ Make sure this import is present

// ✅ Admin: Add product
router.post("/add", authMiddleware, addProduct);

// ✅ Admin: Get all admin-uploaded products
router.get("/admin", authMiddleware, getAdminProducts);

// ✅ Scanner: Get scanned product by name
router.get("/scan/:name", getScannedProductByName);

router.post("/track", authMiddleware, updateUserImpact);

// ✅ Admin: Delete product (only if source is "admin")
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.source !== "admin") {
      return res.status(403).json({ error: "Cannot delete scanned product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
module.exports = router;
