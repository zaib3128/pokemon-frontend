import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [modalType, setModalType] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // NEW: State for hamburger
  const navigate = useNavigate();

  // NEW: Toggle function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // NEW: Function to close menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">

        {/* ================= LOGO ================= */}
        <div className="logo" onClick={() => { navigate("/"); closeMenu(); }}>
          <img src="/images/logo.png" alt="Pokémon Logo" />
        </div>

        {/* ================= HAMBURGER ICON ================= */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* ================= MENU WRAPPER ================= */}
        {/* Toggles the 'active' class based on state */}
        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          
          {/* ================= NAV LINKS ================= */}
          <ul className="nav-links">
            <li>
              <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/pokemons" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                Pokemons
              </NavLink>
            </li>
            <li>
              <NavLink to="/games" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                Games
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorites" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                Favorites
              </NavLink>
            </li>

            {user?.isAdmin && (
              <li>
                <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                  Manage
                </NavLink>
              </li>
            )}
          </ul>

          {/* ================= USER BUTTONS ================= */}
          <div className="nav-buttons">
            {user ? (
              <>
                <span className="user-greeting">
                  Hi, {user.username || user.email}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => { logout(); closeMenu(); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline"
                  onClick={() => { setModalType("login"); closeMenu(); }}
                >
                  Login
                </button>
                <button
                  className="btn btn-fill"
                  onClick={() => { setModalType("signup"); closeMenu(); }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* ================= AUTH MODAL ================= */}
      {modalType && (
        <AuthModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </>
  );
};

export default Navbar;