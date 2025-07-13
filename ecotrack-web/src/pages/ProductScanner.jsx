import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ScanLine } from "lucide-react";

export default function ProductScanner() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ecoScore, setEcoScore] = useState(null);
  const [adminProducts, setAdminProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch admin products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/products/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAdminProducts(data.filter((p) => p.source === "admin"));
      } catch (err) {
        console.error("❌ Failed to load admin products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Handle mock barcode scan
  const handleScan = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEcoScore(Math.floor(Math.random() * 100));
      setSelectedProduct(null);
      setSuccessMessage("");
    }, 1500);
  };

  // Select product from manual search
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setEcoScore(product.ecoScore);
    setSuccessMessage("");
  };

  // Track product impact
const handleTrackImpact = async () => {
  if (!selectedProduct) return;

  try {
    const token = localStorage.getItem("token");

    console.log("🧪 Product to track:", selectedProduct); // Ensure all fields exist

    const body = {
      productId: selectedProduct._id,
      name: selectedProduct.name || "Manual Track",
      brand: selectedProduct.brand || "Unknown",
      category: selectedProduct.category || "Uncategorized",
      ecoScore: selectedProduct.ecoScore || 0,
      carbonFootprint: selectedProduct.carbonFootprint || 0,
      plasticSaved: selectedProduct.plasticSaved || 0,
      carbonOffset: selectedProduct.carbonOffset || 0,
    };

    const res = await fetch("http://localhost:5000/api/dashboard/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

        body: JSON.stringify({
  productId: selectedProduct._id,
  name: selectedProduct.name,
  brand: selectedProduct.brand,
  category: selectedProduct.category,
  ecoScore: selectedProduct.ecoScore,
  carbonFootprint: selectedProduct.carbonFootprint,
  plasticSaved: selectedProduct.plasticSaved,
}),
    });

    const text = await res.text(); // See raw backend response
    console.log("🔁 Track response:", text);

    if (!res.ok) throw new Error("Tracking failed");

    setSuccessMessage("✅ Product impact successfully tracked!");
  } catch (err) {
    console.error("❌ Failed to track product:", err);
    setSuccessMessage("❌ Failed to track impact.");
  }
};


  const filtered = adminProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-100 to-white">
      <h1 className="text-4xl font-bold mb-6 text-green-700">Product Scanner</h1>

      <div className="w-full max-w-xl space-y-6">
        {/* Barcode Scanner */}
        <div className="space-y-4">
          <Input
            placeholder="Enter barcode or scan product"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <Button onClick={handleScan} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <ScanLine />}
            {loading ? "Scanning..." : "Scan Product"}
          </Button>
        </div>

        {/* Search Admin Products */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            🔍 Search Product (Admin DB)
          </h2>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filtered.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2 bg-white">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSelectProduct(p)}
                  className="cursor-pointer px-3 py-2 rounded hover:bg-green-100 border-b"
                >
                  {p.name} -{" "}
                  <span className="text-gray-500 text-sm">{p.brand}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No matches found.</p>
          )}
        </div>

        {/* EcoScore Display */}
        {ecoScore !== null && (
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <span className="text-gray-500">EcoScore</span>
              <div
                className="text-6xl font-extrabold"
                style={{
                  color:
                    ecoScore > 70
                      ? "#16a34a"
                      : ecoScore > 40
                      ? "#f59e0b"
                      : "#dc2626",
                }}
              >
                {ecoScore}
              </div>
              <span className="text-sm text-gray-400">
                {selectedProduct
                  ? `From DB: ${selectedProduct.name}`
                  : "(Mock scanned value)"}
              </span>

              {selectedProduct && (
                <Button
                  onClick={handleTrackImpact}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  Track Impact
                </Button>
              )}

              {successMessage && (
                <p className="text-sm mt-2 text-gray-600">{successMessage}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
