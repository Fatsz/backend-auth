/**
 * @file App.jsx
 * @description Root komponen aplikasi — setup React Router
 * 
 * Alur routing:
 * / → redirect ke /login
 * /login → halaman Login (public)
 * /register → halaman Register (public)
 * /dashboard → halaman Dashboard (PROTECTED)
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    /**
     * BrowserRouter: menggunakan HTML5 History API untuk routing
     * AuthProvider: membungkus semua komponen agar bisa mengakses auth state
     */
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes — dibungkus ProtectedRoute */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 — Tangani route yang tidak ditemukan */}
          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404</h1>
                <p>Halaman tidak ditemukan</p>
                <a href="/login">Kembali ke Login</a>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
