// ✅ Updated App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductScanner from "./pages/ProductScanner";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminProducts from "./pages/AdminProducts";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import PrivateRoute from "@/components/PrivateRoute";
import UserProfile from "./pages/UserProfile";
import Layout from "./components/Layout";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Protected User Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute redirectTo="/login" requiredRole="user">
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute redirectTo="/login" requiredRole="user">
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <PrivateRoute redirectTo="/login" requiredRole="user">
              <Layout><ProductScanner /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute redirectTo="/login" requiredRole="user">
              <Layout><UserProfile /></Layout>
            </PrivateRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute redirectTo="/admin-login" requiredRole="admin">
              <Layout><AdminPanel /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute redirectTo="/admin-login" requiredRole="admin">
              <Layout><AdminProducts /></Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
