import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Movies from "./pages/Movies.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token") || "";
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={localStorage.getItem("token") ? "/movies" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}