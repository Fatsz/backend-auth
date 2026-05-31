/**
 * @file Register.jsx
 * @description Halaman Register — form untuk mendaftarkan user baru
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoggedIn } = useAuth();

  // State form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect jika sudah login
  if (isLoggedIn) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Reset error saat user mengetik
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi client-side
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    setIsLoading(true);

    const result = await register(formData.username, formData.email, formData.password);

    setIsLoading(false);

    if (result.success) {
      setSuccess('Registrasi berhasil! Mengarahkan ke halaman login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1 className="auth-title">Buat Akun Baru</h1>
          <p className="auth-subtitle">Bergabung dan mulai perjalanan Anda</p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Alert Success */}
        {success && (
          <div className="alert alert-success" role="alert">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Masukkan username Anda"
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="nama@email.com"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Minimal 8 karakter"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Konfirmasi Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Ulangi password Anda"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Mendaftar...
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        {/* Link ke Login */}
        <p className="auth-switch">
          Sudah punya akun?{' '}
          <Link to="/login" className="auth-link">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
