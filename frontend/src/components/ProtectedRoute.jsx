/**
 * @file ProtectedRoute.jsx
 * @description Komponen guard untuk melindungi route yang membutuhkan autentikasi
 * 
 * Cara kerja:
 * 1. Cek apakah user sudah login (via useAuth hook)
 * 2. Jika belum login → redirect ke /login
 * 3. Jika sudah login → render komponen yang diminta
 * 4. Saat loading (cek localStorage) → tampilkan spinner
 * 
 * Penggunaan di App.jsx:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  // Saat app baru dimuat, tampilkan loading spinner
  // Ini mencegah redirect ke login yang tidak perlu saat token sedang dicek
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Memuat...</p>
      </div>
    );
  }

  // Jika belum login, redirect ke halaman login
  // State `from` menyimpan URL yang dituju, agar setelah login bisa kembali ke sana
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User sudah login — render halaman yang diminta
  return children;
};

export default ProtectedRoute;
