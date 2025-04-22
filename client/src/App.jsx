import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Pages/ProtectedRoute";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import TaskList from "./Pages/TaskList";
import { Toaster } from "./components/ui/toaster";

// Component to redirect based on authentication status
function RedirectBasedOnAuth() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or show a loading spinner if desired

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="container mx-auto p-6">
                  <TaskList />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Smart redirection */}
          <Route path="/" element={<RedirectBasedOnAuth />} />
          <Route path="*" element={<RedirectBasedOnAuth />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
