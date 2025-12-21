import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  NavLink as RouterNavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, dbUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const avatarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  /* Scroll shadow */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close menus on route change */
  useEffect(() => {
    setOpen(false);
    setAvatarOpen(false);
  }, [location.pathname]);

  /* Outside click close (avatar dropdown) */
  useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Outside click close (mobile menu) */
useEffect(() => {
  const handler = (e) => {
    if (
      open &&
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, [open]);

useEffect(() => {
  const closeOnScroll = () => {
    if (open) setOpen(false);
  };

  window.addEventListener("scroll", closeOnScroll);
  return () => window.removeEventListener("scroll", closeOnScroll);
}, [open]);

/* Close avatar dropdown on scroll */
useEffect(() => {
  const closeAvatarOnScroll = () => {
    if (avatarOpen) {
      setAvatarOpen(false);
    }
  };

  window.addEventListener("scroll", closeAvatarOnScroll);
  return () => window.removeEventListener("scroll", closeAvatarOnScroll);
}, [avatarOpen]);



  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  /* Role-based dashboard landing */
  const getDashboardLink = () => {
    if (!dbUser?.role) return "/dashboard";
    if (dbUser.role === "user") return "/dashboard/user/profile";
    if (dbUser.role === "vendor") return "/dashboard/vendor/profile";
    if (dbUser.role === "admin") return "/dashboard/admin";
    return "/dashboard";
  };

  /* ✅ Dashboard active for ALL nested routes */
  const isDashboardActive = location.pathname.startsWith("/dashboard");

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl text-white shadow-lg">
              <TicketIcon className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-gray-900 dark:text-white">
              MERNickets
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tickets">All Tickets</NavLink>

            {user && (
              <Link
                to={getDashboardLink()}
                className={`font-medium transition-colors ${
                  isDashboardActive
                    ? "text-blue-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle desktop */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2 rounded-full bg-gray-100 dark:bg-gray-800"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Login / Register */}
            {!user && (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600"
                >
                  Login
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Avatar */}
            {user && (
              <div className="relative" ref={avatarRef}>
                <button onClick={() => setAvatarOpen(!avatarOpen)}>
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.displayName}`
                    }
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    alt="avatar"
                  />
                </button>

                <AnimatePresence>
                  {avatarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b dark:border-gray-800">
                        <p className="font-semibold">{user.displayName}</p>
                        <p className="text-xs capitalize">{dbUser?.role}</p>
                      </div>

                      <div className="py-2">
                        {dbUser?.role === "user" && (
                          <>
                            <DropLink to="/dashboard/user/profile">My Profile</DropLink>
                            <DropLink to="/dashboard/user">My Bookings</DropLink>
                            <DropLink to="/dashboard/user/transactions">Transactions</DropLink>
                          </>
                        )}

                        {dbUser?.role === "vendor" && (
                          <>
                            <DropLink to="/dashboard/vendor/profile">Vendor Profile</DropLink>
                            <DropLink to="/dashboard/vendor/my-tickets">My Added Tickets</DropLink>
                            <DropLink to="/dashboard/vendor/add-ticket">Add New Ticket</DropLink>
                            <DropLink to="/dashboard/vendor/requests">Booking Requests</DropLink>
                            <DropLink to="/dashboard/vendor/revenue">Revenue Overview</DropLink>
                          </>
                        )}

                        {dbUser?.role === "admin" && (
                          <DropLink to="/dashboard/admin">Admin Portal</DropLink>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg"
            >
              {open ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

{/* Mobile menu */}
<AnimatePresence>
  {open && (
    <motion.div
  ref={mobileMenuRef}
  initial={{ height: 0 }}
  animate={{ height: "auto" }}
  exit={{ height: 0 }}
  className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden"
>
      <div className="px-4 py-6 space-y-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800"
        >
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          {theme === "dark" ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        <MobileLink to="/">Home</MobileLink>
        <MobileLink to="/tickets">All Tickets</MobileLink>

        {user ? (
          <MobileLink
  to={getDashboardLink()}
  forceActive={isDashboardActive}
>
  Dashboard
</MobileLink>
        ) : (
          <div className="pt-3 flex flex-col gap-3">
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


      {/* Mobile menu (unchanged) */}
    </nav>
  );
}

/* Helpers */
function NavLink({ to, children }) {
  return (
    <RouterNavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        isActive
          ? "text-blue-600 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
      }
    >
      {children}
    </RouterNavLink>
  );
}

function MobileLink({ to, children, forceActive = false }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-xl ${
          isActive || forceActive
            ? "bg-blue-50 text-blue-600 font-medium"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}


/* ✅ FIXED avatar active logic */
function DropLink({ to, children }) {
  return (
    <RouterNavLink
      to={to}
      end
      className={({ isActive }) =>
        `block px-4 py-2 transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}