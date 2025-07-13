const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 👈 name is required
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

module.exports = mongoose.model("Admin", adminSchema);
