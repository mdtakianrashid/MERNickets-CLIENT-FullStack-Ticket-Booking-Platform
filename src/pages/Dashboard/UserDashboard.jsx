// src/pages/Dashboard/UserDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function UserDashboard(){
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <img src={user?.photoURL || `https://avatars.dicebear.com/api/initials/${user?.displayName || user?.email}.svg`} alt="avatar" className="w-16 h-16 rounded-full" />
          <div>
            <div className="font-semibold">{user?.displayName || user?.email}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Link to="/dashboard/mybookings" className="card p-4 text-center">My Booked Tickets</Link>
          <Link to="/dashboard/transactions" className="card p-4 text-center">Transaction History</Link>
          <Link to="/profile" className="card p-4 text-center">Profile</Link>
        </div>
      </div>
    </div>
  );
}