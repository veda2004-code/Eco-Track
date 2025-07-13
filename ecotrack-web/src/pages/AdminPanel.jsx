import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { BarChart3, UploadCloud, Settings } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { login, getProducts, addProduct } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminPanel() {
  const [imagePreview, setImagePreview] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [ecoChartData, setEcoChartData] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [ecoScore, setEcoScore] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");
  const [plasticSaved, setPlasticSaved] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    const fetchData = async () => {
      try {
        const products = await getProducts();
        setProducts(products);

        const scoresByMonth = {};
        products.forEach((product) => {
          const date = new Date(product.createdAt || Date.now());
          const month = date.toLocaleString("default", { month: "short" });

          if (!scoresByMonth[month]) {
            scoresByMonth[month] = { total: 0, count: 0 };
          }

          if (typeof product.ecoScore === "number") {
            scoresByMonth[month].total += product.ecoScore;
            scoresByMonth[month].count += 1;
          }
        });

        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = monthOrder
          .filter((month) => scoresByMonth[month])
          .map((month) => ({
            name: month,
            score: Math.round(scoresByMonth[month].total / scoresByMonth[month].count),
          }));

        setEcoChartData(chartData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, [loggedIn]);

  const handleLogin = async () => {
    setError("");
    try {
      const res = await login(email, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        setLoggedIn(true);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    navigate("/admin-login"); // 👈 go back to login page
};

  const handleSubmitProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const productData = {
        name,
        description: `${brand} ${category}`,
        ecoScore: parseInt(ecoScore),
        imageUrl: imagePreview || "",
        brand,
        category,
        carbonFootprint,
        plasticSaved: parseFloat(plasticSaved),
      };

      await addProduct(productData, token);
      alert("✅ Product uploaded successfully");

      setName("");
      setBrand("");
      setCategory("");
      setEcoScore("");
      setCarbonFootprint("");
      setPlasticSaved("");
      setImagePreview(null);
      setProductImage(null);

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (err) {
      console.error("Product upload failed", err);
      alert("❌ Failed to upload product");
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <Button onClick={handleLogin}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>

        {/* ➕ New Button to View All Products */}
        <div className="mb-6">
          <Link to="/admin/products">
            <Button className="bg-green-600 text-white hover:bg-green-700">
              📦 View All Admin Products
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="upload">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Product
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Card className="mb-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">EcoScore Overview</h2>
                <p className="text-gray-600 mb-4">Average EcoScore by Month</p>
                <div className="h-64">
                  {ecoChartData.length === 0 ? (
                    <p className="text-gray-500 text-center">No data to display yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ecoChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#4ade80" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card className="mb-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Upload New Product</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(file);
                        setProductImage(file);
                      }
                    }}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-4 h-40 rounded shadow" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                  <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                  <Input placeholder="EcoScore (0-100)" type="number" value={ecoScore} onChange={(e) => setEcoScore(e.target.value)} />
                  <Input placeholder="Carbon Footprint (kg CO2)" value={carbonFootprint} onChange={(e) => setCarbonFootprint(e.target.value)} />
                  <Input
                        placeholder="Plastic Saved (g)"
                        type="number"
                        value={plasticSaved}
                        onChange={(e) => setPlasticSaved(e.target.value)}
/>
                </div>
                <Button className="mt-4" onClick={handleSubmitProduct}>Submit</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Admin Settings</h2>
                <p className="text-gray-600">Coming soon: Notifications, Access Control, etc.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
