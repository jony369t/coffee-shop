
import React from "react";
import { FaCoffee, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[#3E2723] text-[#F5F5DC] px-6 py-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <FaCoffee />
            Coffee Shop
          </h2>

          <p className="mt-3 text-sm">
            Enjoy premium coffee crafted with passion.  
            A perfect place for coffee lovers.
          </p>

          <p className="mt-4 text-sm opacity-80">
            © {new Date().getFullYear()} Coffee Shop. All rights reserved.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>

          <ul className="space-y-2">
            <li>
              <NavLink to="/" className="hover:text-[#D7CCC8]">Home</NavLink>
            </li>

            <li>
              <NavLink to="/menu" className="hover:text-[#D7CCC8]">Menu</NavLink>
            </li>

            <li>
              <NavLink to="/Blog" className="hover:text-[#D7CCC8]">Blog</NavLink>
            </li>

            <li>
              <NavLink to="/about" className="hover:text-[#D7CCC8]">About</NavLink>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>

          <div className="flex gap-4 text-xl">

            <a className="hover:text-[#D7CCC8] cursor-pointer">
              <FaFacebook />
            </a>

            <a className="hover:text-[#D7CCC8] cursor-pointer">
              <FaInstagram />
            </a>

            <a className="hover:text-[#D7CCC8] cursor-pointer">
              <FaTwitter />
            </a>

          </div>
        </div>

      </div>

    </footer>
  );
}
