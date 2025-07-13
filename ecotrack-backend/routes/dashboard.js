// 📁 routes/dashboard.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

// 🔢 Get Dashboard Stats
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const scope = req.query.scope || "global";
    const baseFilter = { source: "scanned" };
    const filter = scope === "user" ? { ...baseFilter, userId: req.user.id } : baseFilter;

    const products = await Product.find(filter);

    const productsScanned = products.length;
    const avgEcoScore = products.reduce((sum, p) => sum + (p.ecoScore || 0), 0) / (products.length || 1);
    const plasticSaved = products.reduce((sum, p) => sum + (p.plasticSaved || 0), 0);
    const carbonOffset = products.reduce((sum, p) => sum + (p.carbonFootprint || 0), 0);

    res.json({
      productsScanned,
      avgEcoScore: avgEcoScore.toFixed(1),
      plasticSaved: plasticSaved.toFixed(1),
      carbonOffset: carbonOffset.toFixed(1),
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// 📈 EcoScore Trend Chart (last 5 days)
router.get("/ecoscore-trends", authMiddleware, async (req, res) => {
  try {
    const scope = req.query.scope || "global";
    const baseFilter = { source: "scanned" };
    const filter = scope === "user" ? { ...baseFilter, userId: req.user.id } : baseFilter;

    const products = await Product.find(filter);
    const trends = {};

    for (let product of products) {
      const day = new Date(product.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (!trends[day]) trends[day] = { day, scores: [] };
      trends[day].scores.push(product.ecoScore || 0);
    }

    const result = Object.values(trends)
      .slice(0, 5)
      .map((dayEntry) => ({
        name: dayEntry.day,
        EcoScore:
          dayEntry.scores.reduce((a, b) => a + b, 0) / (dayEntry.scores.length || 1),
      }));

    res.json(result.reverse());
  } catch (err) {
    console.error("EcoScore trends error:", err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// 📝 Track a product manually (selected from Admin DB)
router.post("/track", authMiddleware, async (req, res) => {
  try {
    let {
      productId,
      name,
      brand,
      category,
      ecoScore,
      carbonFootprint,
      plasticSaved,
      carbonOffset,
    } = req.body;

    // Convert values to numbers if they're strings
    ecoScore = Number(ecoScore);
    carbonFootprint = Number(carbonFootprint);
    plasticSaved = Number(plasticSaved);
    carbonOffset = Number(carbonOffset) || 0;

    if (isNaN(ecoScore) || isNaN(carbonFootprint) || isNaN(plasticSaved)) {
      return res.status(400).json({ error: "Missing or invalid product data" });
    }

    await Product.create({
      userId: req.user.id,
      name: name || "Manual Track",
      brand,
      category,
      ecoScore,
      carbonFootprint,
      plasticSaved,
      carbonOffset,
      source: "scanned",
    });

    res.json({ message: "Impact tracked successfully" });
  } catch (err) {
    console.error("Track error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🧾 User Profile: History + Impact Summary
router.get("/user-history", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id, source: "scanned" }).sort({ createdAt: -1 });

    const summary = {
      totalTracked: products.length,
      totalCarbonOffset: products.reduce((sum, p) => sum + (p.carbonFootprint || 0), 0),
      totalPlasticSaved: products.reduce((sum, p) => sum + (p.plasticSaved || 0), 0),
      averageEcoScore:
        products.reduce((sum, p) => sum + (p.ecoScore || 0), 0) / (products.length || 1),
    };

    res.json({ history: products, summary });
  } catch (err) {
    console.error("User history error:", err);
    res.status(500).json({ error: "Failed to load history" });
  }
});

module.exports = router;
