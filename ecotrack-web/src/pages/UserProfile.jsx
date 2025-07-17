import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function UserProfile() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://eco-track-l9dz.onrender.com", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setHistory(data.history || []);
        setSummary(data.summary || {});
        setLoading(false);
      } catch (err) {
        console.error("Failed to load history", err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-green-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-green-800">🌿 Your Impact History</h1>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <h2 className="text-sm text-gray-500">Products Tracked</h2>
                <div className="text-2xl font-bold text-green-700">
                  {summary.totalTracked || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h2 className="text-sm text-gray-500">Carbon Offset</h2>
                <div className="text-2xl font-bold text-green-700">
                  {summary.totalCarbonOffset || 0} kg
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h2 className="text-sm text-gray-500">Plastic Saved</h2>
                <div className="text-2xl font-bold text-green-700">
                  {summary.totalPlasticSaved || 0} g
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Product History */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tracked Products</h2>
          {history.length === 0 ? (
            <p className="text-gray-500">You haven’t tracked any products yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map((p) => (
                <Card key={p._id}>
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <div className="text-lg font-semibold text-green-800">{p.name}</div>
                      <div className="text-sm text-gray-500">
                        Carbon: {p.carbonFootprint || 0} kg, Plastic: {p.plasticSaved || 0} g
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-2 md:mt-0">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
