import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  TicketIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";

function Countdown({ departure }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const diff = new Date(departure) - new Date();
      if (diff <= 0) return setTime("");
      
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      
      setTime(`${d}d ${h}h ${m}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [departure]);

  if (!time) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full w-fit">
      <ClockIcon className="w-3.5 h-3.5" />
      <span>Departing in: {time}</span>
    </div>
  );
}

export default function MyBookings() {
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/bookings").then(res => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return <Spinner className="h-[60vh]" />;

  return (
    <div className="p-6 md:p-8">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TicketIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            My Booked Tickets
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your upcoming trips and payments.
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-sm">
          {bookings.length} Bookings
        </div>
      </div>

      {bookings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TicketIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No bookings yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">You haven't booked any tickets.</p>
          <Link to="/tickets" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Browse Tickets
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {bookings.map(b => {
            const t = b.ticket;
            if (!t) return null; 

            const isFuture = new Date(t.departure) > new Date();
            
            let statusColor = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
            let statusIcon = null;

            if (b.status === "pending") {
              statusColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
              statusIcon = <ClockIcon className="w-4 h-4" />;
            } else if (b.status === "accepted") {
              statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
              statusIcon = <CheckCircleIcon className="w-4 h-4" />;
            } else if (b.status === "paid") {
              statusColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
              statusIcon = <CheckCircleIcon className="w-4 h-4" />;
            } else if (b.status === "rejected") {
              statusColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
              statusIcon = <XCircleIcon className="w-4 h-4" />;
            }

            return (
              <motion.div 
                key={b._id} 
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48">
                  <img 
                    src={t.image || "/placeholder.jpg"} 
                    alt={t.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm backdrop-blur-md ${statusColor}`}>
                    {statusIcon}
                    {b.status}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg truncate">{t.title}</h3>
                    <div className="flex items-center text-sm opacity-90">
                       <MapPinIcon className="w-4 h-4 mr-1" />
                       <span className="truncate">{t.from} → {t.to}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col grow space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Departure Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1 mt-1">
                        <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                        {new Date(t.departure).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Total Amount</p>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1 mt-1">
                        <BanknotesIcon className="w-4 h-4 text-green-500" />
                        ${t.price * b.quantity} <span className="text-xs text-gray-400 font-normal">({b.quantity}x)</span>
                      </p>
                    </div>
                  </div>

                  {(b.status === "pending" || b.status === "accepted") && isFuture && (
                     <Countdown departure={t.departure} />
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    
                    {b.status === "accepted" && isFuture && (
                      <Link
                        to={`/dashboard/user/payment/${b._id}`}
                        className="block w-full py-2.5 bg-linear-to-r from-blue-600 to-cyan-500 text-white text-center font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all"
                      >
                        Pay Now
                      </Link>
                    )}

                    {b.status === "paid" && (
                       <button disabled className="w-full py-2.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-default">
                          <CheckCircleIcon className="w-5 h-5" /> Ticket Confirmed
                       </button>
                    )}

                    {b.status === "pending" && isFuture && (
                       <div className="text-center text-sm text-yellow-600 dark:text-yellow-500 font-medium bg-yellow-50 dark:bg-yellow-900/10 py-2 rounded-lg">
                          Waiting for approval...
                       </div>
                    )}

                    {b.status === "rejected" && (
                       <div className="text-center text-sm text-red-600 dark:text-red-400 font-medium">
                          Booking request rejected.
                       </div>
                    )}

                    {!isFuture && b.status !== "paid" && (
                       <div className="text-center text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/10 py-2 rounded-lg flex items-center justify-center gap-2">
                          <XCircleIcon className="w-4 h-4" /> Departure Passed
                       </div>
                    )}

                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}