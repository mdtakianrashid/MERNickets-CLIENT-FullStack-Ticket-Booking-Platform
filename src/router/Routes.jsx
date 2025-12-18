// src/router/Routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import AllTickets from "../pages/AllTickets/AllTickets";
import TicketDetails from "../pages/TicketDetails/TicketDetails";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";

import UserDashboard from "../pages/Dashboard/UserDashboard";
import VendorDashboard from "../pages/Dashboard/VendorDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import MyBookings from "../pages/Dashboard/MyBookings";
import PaymentPage from "../pages/Dashboard/PaymentPage";

import AddTicket from "../pages/Dashboard/AddTicket";
import MyAddedTickets from "../pages/Dashboard/MyAddedTickets";
import RequestedBookings from "../pages/Dashboard/RequestedBookings";
import VendorRevenue from "../pages/Dashboard/VendorRevenue";
import VendorProfile from "../pages/Dashboard/VendorProfile";

import Transactions from "../pages/Dashboard/Transactions";
import UserProfile from "../pages/Dashboard/UserProfile";

import useAuth from "../hooks/useAuth";

/* ==============================
   Private Route
============================== */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // ⭐ THIS IS THE FIX
      />
    );
  }

  return children;
}

/* ==============================
   Role Route
============================== */
function RoleRoute({ role, children }) {
  const { dbUser, loading } = useAuth();

  if (loading || !dbUser) return <div>Loading...</div>;
  if (dbUser.role !== role) return <Navigate to="/" replace />;

  return children;
}

/* ==============================
   Dashboard Redirect
============================== */
function DashboardRedirect() {
  const { user, dbUser, loading } = useAuth();

  if (loading || !dbUser) return <div>Preparing dashboard...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (dbUser.role === "admin") return <Navigate to="/dashboard/admin" replace />;
  if (dbUser.role === "vendor") return <Navigate to="/dashboard/vendor" replace />;

  return <Navigate to="/dashboard/user" replace />;
}

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tickets" element={<AllTickets />} />

        {/* 🔐 PROTECTED TICKET DETAILS */}
        <Route
          path="ticket/:id"
          element={
            <PrivateRoute>
              <TicketDetails />
            </PrivateRoute>
          }
        />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Dashboard Root */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardRedirect />
            </PrivateRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="dashboard/user"
          element={
            <PrivateRoute>
              <RoleRoute role="user">
                <UserDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        >
          <Route index element={<MyBookings />} />
          <Route path="payment/:bookingId" element={<PaymentPage />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Vendor Dashboard */}
        <Route
          path="dashboard/vendor"
          element={
            <PrivateRoute>
              <RoleRoute role="vendor">
                <VendorDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        >
          <Route index element={<VendorProfile />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="add-ticket" element={<AddTicket />} />
          <Route path="edit-ticket/:id" element={<AddTicket />} />
          <Route path="my-tickets" element={<MyAddedTickets />} />
          <Route path="requests" element={<RequestedBookings />} />
          <Route path="revenue" element={<VendorRevenue />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="dashboard/admin"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}