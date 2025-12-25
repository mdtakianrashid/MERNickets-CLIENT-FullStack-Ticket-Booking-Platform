import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosPublic from "../../utils/axiosPublic";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  TicketIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

function Countdown({ target }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) {
        setTime(null);
        clearInterval(timer);
        return;
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (!time) return <span className="text-red-500 font-bold flex items-center gap-2"><ExclamationCircleIcon className="w-5 h-5"/> Departure has passed</span>;

  return (
    <div className="flex gap-4 text-center">
      {Object.entries(time).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs uppercase mt-2 text-gray-500 font-semibold">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosPublic.get("/tickets").then(res => {
      const found = res.data.find(t => t._id === id);
      setTicket(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Spinner /></div>;
  if (!ticket) return <div className="text-center mt-20 text-2xl font-bold text-gray-500">Ticket not found</div>;

  const isDeparturePassed = new Date(ticket.departure) <= new Date();
  const soldOut = ticket.ticketQuantity <= 0;
  const canBook = !isDeparturePassed && !soldOut;

  const handleBooking = async () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    
    if (quantity < 1 || quantity > ticket.ticketQuantity) {
        alert("Invalid quantity");
        return;
    }

    setBookingLoading(true);
    try {
      await axiosSecure.post("/bookings", { ticketId: ticket._id, quantity });
      
      setShowConfirmModal(false);
      setShowSuccessModal(true); 

    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 transition-colors duration-300 relative">
      
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 dark:bg-blue-900/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/3 group">
            <img 
              src={ticket.image || "/placeholder.jpg"} 
              alt={ticket.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold shadow-sm uppercase tracking-wider">
               {ticket.transportType}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 py-6 px-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" /> Time Until Departure
            </h3>
            <Countdown target={ticket.departure} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            {ticket.title}
          </h1>

          <div className="flex items-center gap-4 text-lg text-gray-600 dark:text-gray-300 mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
             <MapPinIcon className="w-6 h-6 text-blue-500" />
             <span className="font-semibold">{ticket.from}</span>
             <span className="text-gray-400">➜</span>
             <span className="font-semibold">{ticket.to}</span>
          </div>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
             <div className="flex items-center gap-3">
                <CalendarDaysIcon className="w-6 h-6 text-gray-400" />
                <span className="font-medium text-lg">
                  {new Date(ticket.departure).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
                </span>
             </div>
             
             <div className="flex items-center gap-3">
                <TicketIcon className="w-6 h-6 text-gray-400" />
                <span className="font-medium text-lg">
                  <span className={soldOut ? "text-red-500" : "text-green-500"}>
                     {ticket.ticketQuantity} tickets available
                  </span>
                </span>
             </div>
          </div>

          {ticket.perks?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Included Perks</h3>
              <div className="flex flex-wrap gap-3">
                {ticket.perks.map((p, i) => (
                  <span key={i} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" /> {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-8 flex items-center justify-between">
            <div>
               <p className="text-sm text-gray-400">Total Price</p>
               <p className="text-4xl font-extrabold text-gray-900 dark:text-white">৳{ticket.price}</p>
            </div>
            
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!canBook}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isDeparturePassed ? "Departure Passed" : soldOut ? "Sold Out" : "Book Now"}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><XMarkIcon className="w-6 h-6"/></button>
              
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Confirm Booking</h2>
              
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ticket Price</span>
                    <span className="font-bold dark:text-white">${ticket.price}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500">Quantity</span>
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                       <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-50">-</button>
                       <span className="font-bold w-4 text-center dark:text-white">{quantity}</span>
                       <button onClick={() => setQuantity(Math.min(ticket.ticketQuantity, quantity + 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-50">+</button>
                    </div>
                 </div>
                 <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                 <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-blue-600">${(ticket.price * quantity).toFixed(2)}</span>
                 </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {bookingLoading && <Spinner className="w-5 h-5 text-white" />}
                {bookingLoading ? "Processing..." : "Confirm & Pay Later"}
              </button>
            </motion.div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckBadgeIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Booking Request Sent!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                 Your booking for <strong>{ticket.title}</strong> is currently pending approval. check your dashboard for updates.
              </p>

              <button
                onClick={() => navigate("/dashboard/user")}
                className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}