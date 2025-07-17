
// 📁 server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard");
const productRoutes = require("./routes/product.routes");
const uploadRoutes = require("./routes/upload");
const adminRoutes = require("./routes/admin"); // if needed separately


dotenv.config();
const app = express();

app.use(cors({
  origin: "https://eco-track-lemon.vercel.app", // or "*" for testing
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);     // ✅ for admin registration/login

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("EcoTrack Backend Working ✅");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
