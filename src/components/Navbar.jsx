import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Bus, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Modern active link style
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
        : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`;

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section [cite: 35] */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-lg text-white shadow-lg group-hover:shadow-teal-500/30 transition-all duration-300">
              <Bus size={20} />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
              TicketBari
            </span>
          </Link>

          {/* Desktop Navigation  */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/all-tickets" className={navLinkClass}>All Tickets</NavLink>
            {/* Dashboard is a private route, usually shown only when logged in, 
                but requirements say menu items include Dashboard  */}
            {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              // User Dropdown 
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="w-9 h-9 rounded-full ring-2 ring-teal-500/20 group-hover:ring-teal-500 transition-all overflow-hidden">
                    <img
                      src={user.photoURL || 'https://i.ibb.co.com/MgsTcpv/avater.jpg'}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {user.displayName?.split(' ')[0]}
                    </p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 animation-fade-in-up transform origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    
                    {/* Dashboard Link in Dropdown (optional usage) */}
                    <Link 
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)} 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Guest State
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-full shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button  */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {user && (
               <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-gray-100 dark:border-gray-800">
                 <img src={user.photoURL || 'https://i.ibb.co.com/MgsTcpv/avater.jpg'} alt="" className="w-10 h-10 rounded-full" />
                 <div>
                   <div className="font-medium text-gray-900 dark:text-white">{user.displayName}</div>
                   <div className="text-xs text-gray-500">{user.email}</div>
                 </div>
               </div>
            )}

            <NavLink to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              Home
            </NavLink>
            <NavLink to="/all-tickets" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              All Tickets
            </NavLink>
            
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white font-medium">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium shadow-lg">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}