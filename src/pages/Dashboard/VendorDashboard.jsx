import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { 
  UserCircleIcon, 
  PlusCircleIcon, 
  TicketIcon, 
  ClipboardDocumentCheckIcon, 
  BanknotesIcon 
} from "@heroicons/react/24/outline";

export default function VendorDashboard() {
  const { user, dbUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      to: "profile", 
      label: "Vendor Profile", 
      icon: <UserCircleIcon className="w-5 h-5" /> 
    },
    { 
      to: "my-tickets", 
      label: "My Added Tickets", 
      icon: <TicketIcon className="w-5 h-5" /> 
    },
    { 
      to: "add-ticket", 
      label: "Add New Ticket", 
      icon: <PlusCircleIcon className="w-5 h-5" /> 
    },
    { 
      to: "requests", 
      label: "Booking Requests", 
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> 
    },
    { 
      to: "revenue", 
      label: "Revenue Overview", 
      icon: <BanknotesIcon className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <aside className="md:col-span-3 lg:col-span-3">
          
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-xl rounded-3xl overflow-hidden sticky top-24">
            
            <div className="p-8 text-center border-b border-gray-100 dark:border-gray-800 bg-linear-to-b from-purple-50/50 to-transparent dark:from-purple-900/10">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-linear-to-tr from-purple-500 to-pink-400 rounded-full blur opacity-70"></div>
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || "Vendor"}&background=8b5cf6&color=fff`}
                  alt="Profile"
                  className="relative w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-900 shadow-sm"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {user?.displayName || "Vendor Name"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                {dbUser?.email || user?.email}
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase rounded-full tracking-wider border border-purple-200 dark:border-purple-800">
                Vendor
              </span>
            </div>

            <nav className="p-4 hidden md:flex flex-col gap-2">
              {navItems.map((item) => (
                <DashboardNavLink key={item.to} item={item} />
              ))}
            </nav>

            <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
               <div className="flex overflow-x-auto gap-2 p-4 no-scrollbar">
                  {navItems.map((item) => (
                    <DashboardNavLinkMobile key={item.to} item={item} />
                  ))}
               </div>
            </div>

          </div>
        </aside>

        <main className="md:col-span-9 lg:col-span-9">
           <motion.div
             key={location.pathname}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl min-h-125 border border-transparent dark:border-gray-800"
           >
              <Outlet />
           </motion.div>
        </main>

      </div>
    </div>
  );
}

function DashboardNavLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
          isActive
            ? "bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 translate-x-1"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  );
}

function DashboardNavLinkMobile({ item }) {
  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
          isActive
            ? "bg-purple-600 text-white shadow-md"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  );
}