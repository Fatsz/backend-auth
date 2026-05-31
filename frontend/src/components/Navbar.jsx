/**
 * @file Navbar.jsx
 * @description Komponen navigasi bar yang responsif
 * Menampilkan username dan tombol logout jika user sudah login
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="navbar-logo">
          🔐 AuthApp
        </Link>
      </div>
      <div className="navbar-menu">
        {isLoggedIn ? (
          <>
            <span className="navbar-user">
              👤 {user?.username}
            </span>
            <button onClick={handleLogout} className="btn btn-outline-navbar">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost-navbar">Login</Link>
            <Link to="/register" className="btn btn-primary-navbar">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
