// 📁 models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🧮 EcoTrack impact stats
  totalProductsScanned: { type: Number, default: 0 },
  totalCarbonSaved: { type: Number, default: 0 },
  totalPlasticSaved: { type: Number, default: 0 },
  totalEcoScore: { type: Number, default: 0 },
  averageEcoScore: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
