// src/pages/Dashboard/VendorDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function VendorDashboard(){
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/dashboard/add-ticket" className="card p-4">Add Ticket</Link>
        <Link to="/dashboard/my-tickets" className="card p-4">My Added Tickets</Link>
        <Link to="/dashboard/requests" className="card p-4">Requested Bookings</Link>
      </div>
    </div>
  );
}