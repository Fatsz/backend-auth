/**
 * @file Login.jsx
 * @description Halaman Login — form untuk masuk ke aplikasi
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();

  // Ambil URL tujuan sebelum redirect ke login (jika ada)
  const from = location.state?.from?.pathname || '/dashboard';

  // State form
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    setIsLoading(false);

    if (result.success) {
      // Redirect ke halaman yang dituju sebelumnya, atau dashboard
      navigate(from, { replace: true });
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
          <h1 className="auth-title">Selamat Datang</h1>
          <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Alert dari Register sukses */}
        {location.state?.message && (
          <div className="alert alert-success" role="alert">
            <span className="alert-icon">✅</span>
            {location.state.message}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Masuk...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Link ke Register */}
        <p className="auth-switch">
          Belum punya akun?{' '}
          <Link to="/register" className="auth-link">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
