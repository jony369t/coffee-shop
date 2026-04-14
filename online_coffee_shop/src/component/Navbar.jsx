import React from "react";
import { NavLink, useNavigate } from "react-router";
import { FaCoffee } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-[#8B4513] text-white px-3 py-1 rounded-md font-semibold"
      : "text-[#F5F5DC] hover:text-white hover:bg-[#8B4513] px-3 py-1 rounded-md transition";

  // Handle logout
  const handleLogout = () => {
    logout(); // Clears auth state and localStorage
    navigate("/login"); // Redirect to login page
  };

  const links = (
    <>
      <li>
        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/menu" className={linkStyle}>
          Menu
        </NavLink>
      </li>

      <li>
        <NavLink to="/blog" className={linkStyle}>
          Blog
        </NavLink>
      </li>

      <li>
        <NavLink to="/about" className={linkStyle}>
          About
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-[#6b3421] text-[#F5F5DC] shadow-md px-6">
      {/* Left */}
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden text-[#F5F5DC]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#3E2723] rounded-box w-52">
            {links}
          </ul>
        </div>

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-[#F5F5DC]"
        >
          <FaCoffee />
          Coffee Shop
        </NavLink>
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-6 px-1">{links}</ul>
      </div>

      {/* Right */}
      <div className="navbar-end gap-3">
        {/* Cart Button - Show for authenticated users */}
        {isAuthenticated && (
          <NavLink
            to="/cart"
            className="btn btn-sm bg-[#8B4513] border-none text-white hover:bg-[#A0522D] font-bold relative"
          >
            🛒 Cart
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </NavLink>
        )}
        {!isAuthenticated && (
          <NavLink
            to="/login"
            className="btn bg-[#6b3421] border-none text-white hover:bg-[#8B4513]"
          >
            Login
          </NavLink>
        )}

        {/* LOGIC 2: If logged in - Show user info and logout */}
        {isAuthenticated && user && (
          <>
            {/* Dashboard link for regular users */}
            {user.role !== "admin" && (
              <NavLink
                to="/dashboard"
                className="btn btn-sm bg-[#8B4513] border-none text-white hover:bg-[#A0522D] font-bold"
              >
                📦 My Orders
              </NavLink>
            )}

            {/* LOGIC 3: If admin - Show Admin Dashboard link */}
            {user.role === "admin" && (
              <NavLink
                to="/admin/dashboard"
                className="btn btn-sm bg-[#D4AF37] border-none text-[#6b3421] hover:bg-[#FFD700] font-bold"
              >
                📊 Admin
              </NavLink>
            )}

            {/* Show user name */}
            <span className="text-[#F5F5DC] font-semibold">
              👤 {user.name}
            </span>

            {/* Show logout button */}
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-[#8B4513] border-none text-white hover:bg-[#A0522D]"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
