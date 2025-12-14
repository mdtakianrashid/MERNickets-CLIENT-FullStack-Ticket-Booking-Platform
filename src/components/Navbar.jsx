// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/hooks/useAuth";

export default function Navbar(){
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async ()=>{
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="inline-block bg-blue-600 text-white rounded-full p-2">🚌</span>
          <span>TicketBari</span>
        </Link>

        <div className="hidden md:flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/tickets" className="hover:underline">All Tickets</Link>
          {user ? <Link to="/dashboard" className="hover:underline">Dashboard</Link> : null}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <img src={user.photoURL || `https://avatars.dicebear.com/api/initials/${user.displayName||user.email}.svg`} alt="avatar" className="w-8 h-8 rounded-full" />
              <div className="hidden sm:block">
                <div className="text-sm">{user.displayName || user.email}</div>
                <button onClick={handleLogout} className="text-xs text-red-600 btn-primary">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn-outline">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger omitted for brevity */}
      </div>
    </nav>
  );
}