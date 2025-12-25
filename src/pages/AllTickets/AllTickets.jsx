import React, { useEffect, useMemo, useState } from "react";
import axiosPublic from "../../utils/axiosPublic";
import Spinner from "../../components/Spinner";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TicketIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [queryFrom, setQueryFrom] = useState("");
  const [queryTo, setQueryTo] = useState("");
  const [transport, setTransport] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    setQueryFrom(searchParams.get("from") || "");
    setQueryTo(searchParams.get("to") || "");
    setTransport(searchParams.get("transport") || "");
    setDepartureDate(searchParams.get("date") || "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get("/tickets")
      .then(res => setTickets(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let arr = [...tickets];

    if (queryFrom)
      arr = arr.filter(t =>
        t.from?.toLowerCase().includes(queryFrom.toLowerCase())
      );

    if (queryTo)
      arr = arr.filter(t =>
        t.to?.toLowerCase().includes(queryTo.toLowerCase())
      );

    if (transport)
      arr = arr.filter(
        t => t.transportType?.toLowerCase() === transport.toLowerCase()
      );

    if (departureDate)
      arr = arr.filter(t =>
        new Date(t.departure).toISOString().slice(0, 10) === departureDate
      );

    if (sort === "price_asc") arr.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") arr.sort((a, b) => b.price - a.price);

    return arr;
  }, [tickets, queryFrom, queryTo, transport, departureDate, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">Next Journey</span>
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Explore the best routes across the country.
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length} Tickets Found</span>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 mb-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* FROM CITY INPUT */}
        <div className="relative group">
            <MapPinIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
            <input 
                value={queryFrom} 
                onChange={e => setQueryFrom(e.target.value)} 
                placeholder="From City" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
        </div>

        {/* TO DESTINATION INPUT */}
        <div className="relative group">
            <MapPinIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
            <input 
                value={queryTo} 
                onChange={e => setQueryTo(e.target.value)} 
                placeholder="To Destination" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
        </div>

        {/* TRANSPORT SELECT */}
        <div className="relative group">
            <AdjustmentsHorizontalIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
            <select 
                value={transport} 
                onChange={e => setTransport(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer appearance-none"
            >
                <option value="" className="text-gray-500">All Transport</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="launch">Launch</option>
                <option value="plane">Plane</option>
            </select>
        </div>

        {/* DEPARTURE DATE INPUT */}
        <div className="relative group">
            <input 
                type="date"
                value={departureDate} 
                onChange={e => setDepartureDate(e.target.value)} 
                className="w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:scheme-dark"
            />
        </div>

        {/* SORT SELECT */}
        <div className="relative group">
            <FunnelIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
            <select 
                value={sort} 
                onChange={e => setSort(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer appearance-none"
            >
                <option value="" className="text-gray-500">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
            </select>
        </div>
    </div>
</div>

        {paginated.length > 0 ? (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {paginated.map(ticket => (
                    <motion.div 
                        key={ticket._id} 
                        variants={itemVariants}
                        whileHover={{ y: -8 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 flex flex-col h-full group"
                    >

                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src={ticket.image || "/placeholder.jpg"} 
                                alt={ticket.title} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                            />
                            <div className="absolute top-3 right-3">
                                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase border border-white/20">
                                    {ticket.transportType}
                                </span>
                            </div>

                            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg px-3 py-1 flex items-center gap-1 text-xs font-bold shadow-sm">
                                <CalendarDaysIcon className="w-3 h-3 text-blue-500" />
                                <span className="text-gray-800 dark:text-gray-200">
                                    {new Date(ticket.departure).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex flex-col grow">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">
                                {ticket.title}
                            </h3>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium uppercase text-gray-400">From</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-25">{ticket.from}</span>
                                </div>
                                <div className="flex items-center px-2">
                                    <span className="text-blue-500">➜</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-medium uppercase text-gray-400">To</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-25">{ticket.to}</span>
                                </div>
                            </div>

                            {ticket.perks?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {ticket.perks.slice(0, 3).map((perk, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                            {perk}
                                        </span>
                                    ))}
                                    {ticket.perks.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] rounded-md">
                                            +{ticket.perks.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Price per person</span>
                                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                        ৳{ticket.price}
                                    </span>
                                </div>
                                <Link to={`/ticket/${ticket._id}`}>
                                    <motion.button 
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Book Now
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        ) : (

            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20"
            >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No tickets found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search for a different route.</p>
            </motion.div>
        )}

        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                
                <span className="font-mono text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
}