const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // or "bcrypt" if you used bcrypt


exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ Hash password
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Include role in token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, name: admin.name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login error" });
  }
};
