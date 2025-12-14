// src/router/Routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Home from "../../pages/Home/Home";
import AllTickets from "../../pages/AllTickets/AllTickets";
import TicketDetails from "../../pages/TicketDetails/TicketDetails";
import Login from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import NotFound from "../../pages/NotFound";
import PaymentPage from "../../pages/Dashboard/PaymentPage";
import { useAuth } from "../hooks/useAuth";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if(loading) return <div>Loading...</div>;
  if(!user) return <Navigate to="/login" replace />;
  return children;
}

export default function RoutesApp(){
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tickets" element={
          <Protected><AllTickets /></Protected>
        } />
        <Route path="ticket/:id" element={
          <Protected><TicketDetails /></Protected>
        } />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="payment/:bookingId" element={<Protected><PaymentPage/></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}