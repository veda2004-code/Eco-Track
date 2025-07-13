// src/components/EcoScore.jsx
export default function EcoScore({ score }) {
  const getColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="text-center border p-4 rounded shadow">
      <p className="text-lg font-semibold">EcoScore</p>
      <p className={`text-5xl font-bold ${getColor()}`}>{score}</p>
    </div>
  );
}
