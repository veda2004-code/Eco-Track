import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    // ✅ Store token + admin info + role
    localStorage.setItem("token", data.token);
    localStorage.setItem("adminName", data.name);
    localStorage.setItem("role", "admin"); // ✅ THIS LINE IS ESSENTIAL

    navigate("/admin");
  } catch (err) {
    setErrorMsg(err.message);
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Admin Login</h2>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
        />
        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
        <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
          Login
        </Button>
        <p className="text-sm mt-2 text-center">
          New admin? <a href="/admin-register" className="text-green-700 underline">Register here</a>
        </p>
      </div>
    </div>
  );
}
