// 📁 models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    ecoScore: { type: Number, required: true },
    imageUrl: String,
    brand: String,
    category: String,
    carbonFootprint: Number,
    plasticSaved: Number,
    carbonOffset: Number,
    plasticSaved: {
  type: Number,
  default: 0,
},


    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    source: {
      type: String,
      enum: ["admin", "scanned"],
      default: "scanned",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
