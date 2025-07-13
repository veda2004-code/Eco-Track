const Product = require("../models/Product");
const User = require("../models/User");

// ✅ Add Product (admin)
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      brand,
      category,
      ecoScore,
      carbonFootprint,
      plasticSaved,
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      imageUrl,
      brand,
      category,
      ecoScore,
      carbonFootprint,
      plasticSaved,
      source: "admin",
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get admin products
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({ source: "admin" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Get admin products error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get scanned product by name
const getScannedProductByName = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.findOne({ name: { $regex: new RegExp(name, "i") }, source: "scanned" });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Get scanned product error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update user impact when product added to dashboard
const updateUserImpact = async (req, res) => {
  try {
    const userId = req.userId; // From authMiddleware
    const { ecoScore, carbonFootprint, plasticSaved } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.totalProductsScanned += 1;
    user.totalEcoScore += ecoScore;
    user.totalCarbonSaved += parseFloat(carbonFootprint || 0);

    // ✅ Correct handling of numeric plasticSaved
    const plasticValue = parseFloat(plasticSaved || 0);
    user.totalPlasticSaved += plasticValue;

    user.averageEcoScore = user.totalEcoScore / user.totalProductsScanned;

    await user.save();

    res.json({
      message: "Impact updated",
      userStats: {
        totalProductsScanned: user.totalProductsScanned,
        totalCarbonSaved: user.totalCarbonSaved,
        totalPlasticSaved: user.totalPlasticSaved,
        averageEcoScore: user.averageEcoScore,
      },
    });
  } catch (err) {
    console.error("Impact update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  addProduct,
  getAdminProducts,
  getScannedProductByName,
  updateUserImpact, // ✅ include this in exports
};
