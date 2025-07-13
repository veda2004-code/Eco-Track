import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [scope, setScope] = useState("global");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Sending token:", token);

    const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
    }
  };

    const fetchEmail = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setEmail(data.email);
      } catch (err) {
        console.error("Failed to fetch admin email", err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/dashboard/stats?scope=${scope}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    const fetchTrends = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/dashboard/ecoscore-trends?scope=${scope}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch trends", err);
      }
    };

    fetchEmail();
    fetchStats();
    fetchTrends();

    const interval = setInterval(() => {
      fetchStats();
      fetchTrends();
    }, 10000);

    return () => clearInterval(interval);
  }, [scope]);

  if (!stats)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading dashboard...
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-semibold text-green-800 mb-2">
        Welcome, {localStorage.getItem("adminName")}
      </h1>

      <h2 className="text-3xl font-bold text-green-700 mb-2 flex items-center gap-2">
        🌍 Eco Impact Dashboard
      </h2>

      <p className="text-md text-gray-600 mb-6 text-center max-w-xl">
        Every product you scan is a step toward a greener future. Track your
        eco impact and inspire change!
      </p>

      {/* Scope toggle */}
      <div className="mb-6">
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="border px-4 py-2 rounded-md shadow"
        >
          <option value="global">🌐 Global Stats</option>
          <option value="user">👤 My Stats</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">Products Scanned</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.productsScanned}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">Avg. EcoScore</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.avgEcoScore}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">Plastic Saved</p>
          <p className="text-2xl font-bold text-green-600">
            {(stats.plasticSaved / 1000).toFixed(2)} kg

          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">Carbon Offset</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.carbonOffset} kg CO₂
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        🧾 This dashboard reflects your collective sustainable shopping
        efforts!
      </p>

      {/* Chart */}
      <div className="mt-10 w-full max-w-4xl bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          EcoScore Trends (Last 5 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="EcoScore"
              stroke="#10B981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
