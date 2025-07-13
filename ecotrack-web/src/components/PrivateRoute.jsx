// ✅ Updated PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, redirectTo = "/login", requiredRole }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={redirectTo} />;

  try {
    const decoded = jwtDecode(token);
    const localRole = localStorage.getItem("role");
    if (requiredRole && localRole !== requiredRole) {
      return <Navigate to={redirectTo} />;
    }
    return children;
  } catch {
    return <Navigate to={redirectTo} />;
  }
};

export default PrivateRoute;
