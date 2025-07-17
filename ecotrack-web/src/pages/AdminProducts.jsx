import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const fetchAdminProducts = async () => {
    setLoading(true);
    setStatus("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eco-track-l9dz.onrender.com", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const adminOnly = data.filter((p) => p.source === "admin");
      setProducts(adminOnly);
      setStatus("");
    } catch (err) {
      console.error("Failed to fetch products", err);
      setStatus("❌ Failed to fetch admin products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://eco-track-l9dz.onrender.com`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setStatus("✅ Product deleted successfully");
      fetchAdminProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
      setStatus("❌ Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-green-800">📦 Admin Uploaded Products
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : status ? (
          <p className="text-sm mb-4 text-red-500">{status}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products uploaded by admin yet.</p>
        ) : (
          <Card>
            <CardContent className="p-4 overflow-x-auto">
              <table className="min-w-full bg-white border text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left">Image</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Brand</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">EcoScore</th>
                    <th className="py-2 px-4 text-left">Carbon</th>
                    <th className="py-2 px-4 text-left">Plastic Saved (g)</th>
                    <th className="py-2 px-4 text-left">Uploaded</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2 px-4">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </td>
                      <td className="py-2 px-4">{p.name}</td>
                      <td className="py-2 px-4">{p.brand}</td>
                      <td className="py-2 px-4">{p.category}</td>
                      <td className="py-2 px-4">{p.ecoScore}</td>
                      <td className="py-2 px-4">{p.carbonFootprint}</td>
                      <td className="py-2 px-4">{p.plasticSaved || 0}</td>
                      <td className="py-2 px-4">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
