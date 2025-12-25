import React, { useEffect, useState } from "react";
import axiosPublic from "../../utils/axiosPublic";
import Spinner from "../../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import heroVideo from "../../assets/heroVideo.mp4";
import { motion } from "framer-motion";
import { MapPinIcon, CalendarDaysIcon, TicketIcon, ShieldCheckIcon, GlobeAltIcon, BoltIcon, StarIcon } from "@heroicons/react/24/outline";

export default function Home() {

  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [transport, setTransport] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosPublic.get("/tickets")
      .then(res => {
        const all = res.data || [];
        setAdvertised(all.filter(t => t.advertised).slice(0, 6));
        setLatest(
          all
            .slice()
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 8)
        );
      })
      .finally(() => setLoading(false));
  }, []);
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (transport) params.set("transport", transport);
    if (date) params.set("date", date);
    navigate(`/tickets?${params.toString()}`);
  };

  if (loading) return <Spinner />;
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-gray-50 dark:to-gray-950" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4"
          >
            Explore the World <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
              One Ticket at a Time
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-200 text-lg md:text-xl max-w-2xl mb-8"
          >
            A Modern Online Ticket Booking Platform. Book Bus, Train, Launch, and Flight tickets instantly with MERNickets.
          </motion.p>
        </div>
      </section>

      <div className="relative z-20 -mt-24 px-4">
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="max-w-5xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 border border-white/20 dark:border-gray-700/50"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
      
      {/* FROM INPUT */}
      <div className="relative group">
        <MapPinIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
        <input 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
          placeholder="From City" 
          value={from} 
          onChange={e=>setFrom(e.target.value)} 
        />
      </div>

      {/* TO INPUT */}
      <div className="relative group">
        <MapPinIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
        <input 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
          placeholder="To Destination" 
          value={to} 
          onChange={e=>setTo(e.target.value)} 
        />
      </div>

      {/* TRANSPORT SELECT */}
      <div className="relative group">
        <TicketIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
        <select 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
          value={transport} 
          onChange={e=>setTransport(e.target.value)}
        >
          <option value="" className="text-gray-500">Any Transport</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="launch">Launch</option>
          <option value="plane">Plane</option>
        </select>
      </div>

      {/* DATE INPUT */}
      <div className="relative group">
        <input 
          type="date" 
          className="w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-black dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:scheme-dark" 
          value={date} 
          onChange={e=>setDate(e.target.value)} 
        />
      </div>

      {/* SEARCH BUTTON */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSearch} 
        className="w-full py-3 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all border border-transparent"
      >
        Search Tickets
      </motion.button>
    </div>
  </motion.div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-20 mt-16">
        
        {advertised.length > 0 && (
          <Section title="Featured Promotions" icon={<StarIcon className="h-6 w-6 text-yellow-500"/>}>
            {advertised.map(t => <TicketCard key={t._id} ticket={t} />)}
          </Section>
        )}

        <Section title="Latest Arrivals" icon={<BoltIcon className="h-6 w-6 text-blue-500"/>}>
          {latest.map(t => <TicketCard key={t._id} ticket={t} />)}
        </Section>

        <section>
  <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeIn}
    className="text-center mb-10"
  >

    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Routes</h2>
    
    <p className="text-gray-600 dark:text-gray-300 mt-2 font-medium">Most traveled destinations this month</p>
  </motion.div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {["Dhaka → Sylhet", "Sylhet → London", "Dhaka → Dubai", "Sylhet → Cox's Bazar"].map((r, index) => (
      <motion.div 
        key={r}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all cursor-pointer group"
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🚏
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {r}
          </h3>
        </div>
      </motion.div>
    ))}
  </div>
</section>

        <section className="bg-blue-50 dark:bg-gray-900/50 rounded-3xl p-8 md:p-16 relative overflow-hidden">
  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" />
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200/20 dark:bg-cyan-900/20 rounded-full blur-3xl -z-10" />
  
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
      Why Choose MERNickets?
    </h2>
    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
      We make your journey comfortable and safe
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
     <FeatureCard icon={<ShieldCheckIcon className="w-8 h-8"/>} title="Secure Payments" desc="100% protected transactions" />
     <FeatureCard icon={<BadgeCheckIcon className="w-8 h-8"/>} title="Verified Vendors" desc="Trusted travel partners only" />
     <FeatureCard icon={<BoltIcon className="w-8 h-8"/>} title="Instant Booking" desc="Get your ticket in seconds" />
     <FeatureCard icon={<GlobeAltIcon className="w-8 h-8"/>} title="Global Routes" desc="Travel anywhere with us" />
  </div>
</section>

      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        {icon}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {children}
      </motion.div>
    </section>
  );
}

function TicketCard({ ticket }) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={item}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group flex flex-col h-full"
    >

      <div className="relative h-48 overflow-hidden">
        <img 
          src={ticket.image || "/placeholder.jpg"} 
          alt={ticket.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
          {ticket.transport || "Travel"}
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{ticket.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
           <span className="truncate max-w-[45%]">{ticket.from}</span>
           <span className="mx-2">→</span>
           <span className="truncate max-w-[45%]">{ticket.to}</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">Price</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">৳{ticket.price}</span>
          </div>
          <Link to={`/ticket/${ticket._id}`}>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              See Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
      <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{desc}</p>
    </div>
  );
}

function BadgeCheckIcon({className}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    )
}