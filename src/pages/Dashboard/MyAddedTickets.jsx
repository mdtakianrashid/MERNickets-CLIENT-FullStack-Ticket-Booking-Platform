import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import { 
  TicketIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";

export default function MyAddedTickets() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    const res = await axiosSecure.get("/tickets/vendor");
    setTickets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmDelete) return;

    await axiosSecure.delete(`/tickets/${id}`);
    fetchTickets();
  };

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

  function TakaSvg({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <text x="4" y="20" fontSize="20" fontFamily="Arial">৳</text>
    </svg>
  );
}

  return (
    <div className="p-6 md:p-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TicketIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            My Inventory
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your listed tickets and their statuses.
          </p>
        </div>
        
        <Link 
          to="/dashboard/vendor/add-ticket"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700"
        >
          <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TicketIcon className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No tickets added yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Start by creating your first ticket listing.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tickets.map((ticket) => {
            
            let statusColor = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
            let statusIcon = null;

            if (ticket.status === "pending") {
              statusColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
              statusIcon = <ClockIcon className="w-4 h-4" />;
            } else if (ticket.status === "approved" || ticket.status === "accepted") {
              statusColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
              statusIcon = <CheckCircleIcon className="w-4 h-4" />;
            } else if (ticket.status === "rejected") {
              statusColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
              statusIcon = <XCircleIcon className="w-4 h-4" />;
            }

            const isRejected = ticket.status === "rejected";

            return (
              <motion.div 
                key={ticket._id} 
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-full group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={ticket.image || "/placeholder.jpg"} 
                    alt={ticket.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm backdrop-blur-md ${statusColor}`}>
                    {statusIcon}
                    {ticket.status}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg truncate">{ticket.title}</h3>
                    {(ticket.from && ticket.to) && (
                        <div className="flex items-center text-sm opacity-90">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span className="truncate">{ticket.from} → {ticket.to}</span>
                        </div>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col grow">
                  <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Selling Price</span>
                    <span className="font-bold text-gray-900 dark:text-white flex items-center text-lg">
                        <TakaSvg className="w-5 h-5 text-purple-500 mr-1" />
                        {ticket.price}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                    <button
                      disabled={isRejected}
                      onClick={() => navigate(`/dashboard/vendor/edit-ticket/${ticket._id}`)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Update
                    </button>

                    <button
                      disabled={isRejected}
                      onClick={() => handleDelete(ticket._id)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                  
                  {isRejected && (
                      <p className="text-center text-xs text-red-500 mt-3 font-medium">
                          Action unavailable for rejected items
                      </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}