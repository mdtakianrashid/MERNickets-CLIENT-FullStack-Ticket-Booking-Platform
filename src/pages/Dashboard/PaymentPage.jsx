// src/pages/Dashboard/PaymentPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../components/PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function PaymentPage(){
  const { bookingId } = useParams();
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm bookingId={bookingId}/>
      </Elements>
    </div>
  );
}