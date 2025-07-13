const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 🔐 Admin Login
export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return await res.json(); // { token: "..." }
}

// 🆕 Admin Registration
export async function register(email, password) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return await res.json(); // { message: "User registered" }
}

// ➕ Add Product (Admin-only)
export async function addProduct(product, token) {
  const res = await fetch(`${API_URL}/api/products/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Product add failed");
  }

  return await res.json(); // { message: "Product added successfully" }
}

// 🖼 Upload Image
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Image upload failed");
  }

  return await res.json(); // { imageUrl: "http://..." }
}

// 📦 Get All Products
export async function getProducts() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/products/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch admin products");

  return await res.json();
}

export async function getScannedProductByName(name) {
  const res = await fetch(`${API_URL}/api/products/scan/${name}`);
  if (!res.ok) throw new Error("Scanned product not found");
  return await res.json();
}

