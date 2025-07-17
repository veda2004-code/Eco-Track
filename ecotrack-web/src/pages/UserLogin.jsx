// ✅ Updated UserLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://eco-track-l9dz.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save token and role to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("userEmail", data.email);

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-6">
      <div className="max-w-sm w-full bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-green-700">User Login</h1>
        <Input
          type="email"
          placeholder="Email"
          className="mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
        <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
          Login
        </Button>
        <p className="text-sm mt-2 text-center">
          New user? <a href="/register" className="text-green-700 underline">Register here</a>
        </p>
      </div>
    </div>
  );
}