/**
 * @file Dashboard.jsx
 * @description Halaman Dashboard — halaman protected setelah login berhasil
 * Menampilkan data profile user yang diambil dari API backend
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State: data profile dari API (lebih segar dari localStorage)
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');

  /**
   * Ambil data profile dari protected endpoint saat komponen dimuat
   * Ini menunjukkan cara menggunakan protected route dengan JWT
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        // axiosInstance otomatis menambahkan token ke header (via interceptor)
        const response = await axiosInstance.get('/user/profile');
        setProfile(response.data.data.user);
      } catch (err) {
        setProfileError(
          err.response?.data?.message || 'Gagal memuat data profile'
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Format tanggal join
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* Header Dashboard */}
          <div className="dashboard-header">
            <div className="dashboard-avatar">
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="dashboard-welcome">
              <h1 className="dashboard-title">
                Selamat Datang, {user?.username}! 👋
              </h1>
              <p className="dashboard-subtitle">
                Anda berhasil masuk ke sistem autentikasi JWT
              </p>
            </div>
          </div>

          {/* Status Autentikasi */}
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>Terautentikasi dengan JWT Token</span>
          </div>

          {/* Card Grid */}
          <div className="card-grid">

            {/* Card: Data Profile */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <span>👤</span> Data Profile
                </h2>
              </div>
              <div className="card-body">
                {isLoadingProfile ? (
                  <div className="card-loading">
                    <div className="loading-spinner-sm"></div>
                    <span>Memuat data profile...</span>
                  </div>
                ) : profileError ? (
                  <div className="alert alert-error">{profileError}</div>
                ) : (
                  <div className="profile-list">
                    <div className="profile-item">
                      <span className="profile-label">ID</span>
                      <span className="profile-value profile-id">
                        {profile?.id}
                      </span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Username</span>
                      <span className="profile-value">@{profile?.username}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Email</span>
                      <span className="profile-value">{profile?.email}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Bergabung</span>
                      <span className="profile-value">
                        {formatDate(profile?.created_at)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card: Info JWT */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <span>🔐</span> Informasi Token
                </h2>
              </div>
              <div className="card-body">
                <div className="profile-list">
                  <div className="profile-item">
                    <span className="profile-label">Status Token</span>
                    <span className="profile-value token-valid">✅ Valid</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Tipe</span>
                    <span className="profile-value">Bearer JWT</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Masa Berlaku</span>
                    <span className="profile-value">24 Jam</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Disimpan di</span>
                    <span className="profile-value">localStorage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Fitur Sistem */}
            <div className="card card-full">
              <div className="card-header">
                <h2 className="card-title">
                  <span>⚡</span> Fitur Sistem Autentikasi
                </h2>
              </div>
              <div className="card-body">
                <div className="feature-grid">
                  {[
                    { icon: '📝', title: 'Register', desc: 'Daftar akun dengan validasi input & bcrypt hashing' },
                    { icon: '🔑', title: 'Login', desc: 'Autentikasi dengan email & password, generate JWT' },
                    { icon: '🛡️', title: 'Protected Route', desc: 'Halaman ini hanya bisa diakses dengan token valid' },
                    { icon: '🚪', title: 'Logout', desc: 'Hapus token dari localStorage & clear state' },
                    { icon: '🗄️', title: 'Supabase', desc: 'Data tersimpan aman di PostgreSQL cloud' },
                    { icon: '⚡', title: 'Axios Interceptor', desc: 'Token otomatis dikirim di setiap API request' },
                  ].map((feature) => (
                    <div key={feature.title} className="feature-card">
                      <div className="feature-icon">{feature.icon}</div>
                      <div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-desc">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="dashboard-footer">
            <button onClick={handleLogout} className="btn btn-danger btn-logout">
              🚪 Logout dari Akun
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
