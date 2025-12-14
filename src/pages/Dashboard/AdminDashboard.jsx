// src/pages/Dashboard/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard(){
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/dashboard/manage-tickets" className="card p-4">Manage Tickets</Link>
        <Link to="/dashboard/manage-users" className="card p-4">Manage Users</Link>
        <Link to="/dashboard/advertise" className="card p-4">Advertise Tickets</Link>
      </div>
    </div>
  );
}