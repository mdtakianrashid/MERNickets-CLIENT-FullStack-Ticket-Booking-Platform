import React from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

function CheckoutForm({ booking }) {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      // Step 1: Create PaymentIntent
      const { data } = await axiosSecure.post("/payments/create-intent", {
        price: booking.totalPrice,
      });

      const clientSecret = data.clientSecret;

      // Step 2: Confirm payment with card info
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      // Step 3: Mark booking as paid
      if (result.paymentIntent.status === "succeeded") {
        await axiosSecure.patch(`/payments/confirm/${booking._id}`, {
          transactionId: result.paymentIntent.id,
        });

        toast.success("Payment successful");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment failed");
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <CardElement className="border p-3 rounded" />
      <button className="btn mt-4" disabled={!stripe}>
        Pay ${booking.totalPrice}
      </button>
    </form>
  );
}

export default function CheckoutWrapper({ booking }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm booking={booking} />
    </Elements>
  );
}