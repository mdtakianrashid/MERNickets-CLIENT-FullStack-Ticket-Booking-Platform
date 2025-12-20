import React, { useState, useEffect } from "react";
import { Link, NavLink as RouterNavLink, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SunIcon, 
  MoonIcon, 
  Bars3Icon, 
  XMarkIcon, 
  ArrowRightStartOnRectangleIcon, 
  TicketIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800" 
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="bg-linear-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <TicketIcon className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-cyan-400 transition-all">
              MERNickets
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tickets">All Tickets</NavLink>
            {user && <NavLink to="dashboard">Dashboard</NavLink>}
          </div>

          <div className="flex items-center gap-4">
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
            >
              {theme === "dark" ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
            </motion.button>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user.displayName?.split(" ")[0]}
                  </span>
                </div>
                
                <div className="relative group">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=0D8ABC&color=fff`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                </motion.button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-gray-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {open ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <MobileLink to="/">Home</MobileLink>
              <MobileLink to="/tickets">All Tickets</MobileLink>
              {user && <MobileLink to="/dashboard">Dashboard</MobileLink>}
              
              {!user && (
                <div className="pt-4 flex flex-col gap-3">
                  <Link 
                    to="/login"
                    className="w-full py-3 text-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="w-full py-3 text-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg"
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <RouterNavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `relative font-medium py-2 transition-colors
        ${
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transition-transform duration-300 origin-left
            ${isActive ? "scale-x-100" : "scale-x-0"}`}
          />
        </>
      )}
    </RouterNavLink>
  );
}


function MobileLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-3 rounded-xl transition-all"
    >
      {children}
    </Link>
  );
}