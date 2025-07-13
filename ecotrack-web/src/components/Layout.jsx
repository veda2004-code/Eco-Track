import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ✅ Import Button

export default function Layout({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 EcoTrack</h1>
        <div className="space-x-4 flex items-center">
          <Link to="/dashboard" className="hover:text-green-300">Dashboard</Link>
          <Link to="/scan" className="hover:text-green-300">Scan</Link>
          <Link to="/profile" className="hover:text-green-300">Profile</Link>
          <Link to="/admin" className="hover:text-green-300">Admin</Link>

      


          {isLoggedIn && (
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userEmail");
                window.location.href = "/login";
              }}
              className="ml-4 bg-white text-green-600 hover:bg-red-100"
            >
              Logout
            </Button>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
