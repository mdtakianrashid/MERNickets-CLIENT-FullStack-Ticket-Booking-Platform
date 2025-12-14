// src/components/PaymentForm.jsx
import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosSecure from "../pages/utils/axiosSecure";
import axiosPublic from "../pages/utils/axiosPublic";

export default function PaymentForm({ bookingId }){
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(()=>{
    // fetch booking to show amount
    axiosSecure.get("/bookings").then(res=>{
      const b = (res.data || []).find(x=> x._id === bookingId);
      setBooking(b);
    }).catch(()=>{});
  }, [bookingId]);

  useEffect(()=>{
    if(!bookingId) return;
    // create payment intent
    axiosSecure.post("/payments/create-payment-intent", { bookingId })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(err => alert(err?.response?.data?.message || "Payment init error"));
  }, [bookingId]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!stripe || !elements) return;
    setLoading(true);
    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card, billing_details: { name: "Billing User" } }
    });

    if(result.error) {
      alert(result.error.message);
      setLoading(false);
    } else {
      if(result.paymentIntent && result.paymentIntent.status === "succeeded"){
        // notify server to mark booking paid
        await axiosSecure.patch("/bookings/confirm", { bookingId, transactionId: result.paymentIntent.id });
        alert("Payment successful");
      }
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="mb-4">
        <div>Booking: {booking ? booking.ticketTitle || booking.ticketId : bookingId}</div>
        <div>Amount: {booking ? `$${booking.totalPrice}` : "—"}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <CardElement options={{ hidePostalCode: true }} />
        <button type="submit" className="btn mt-4" disabled={!clientSecret || loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}