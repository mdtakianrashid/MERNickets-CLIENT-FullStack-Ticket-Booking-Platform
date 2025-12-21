import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import { TicketIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-white dark:bg-gray-950 pt-20 pb-10 overflow-hidden">
      
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

      <div className="absolute -top-25 -left-25 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >

          <motion.div variants={item} className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-linear-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <TicketIcon className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
                MERNickets
              </span>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A Modern Online Ticket Booking Platform. Experience the joy of seamless travel. Book bus, train, launch, and flight tickets instantly securely and reliably.
            </p>

            <div className="flex gap-4">
              <SocialIcon href="#" label="Facebook"><FaFacebookF /></SocialIcon>
              <SocialIcon href="#" label="Instagram"><FaInstagram /></SocialIcon>
              <SocialIcon href="#" label="Twitter"><FaXTwitter /></SocialIcon>
              <SocialIcon href="#" label="LinkedIn"><FaLinkedinIn /></SocialIcon>
              <SocialIcon href="#" label="GitHub"><FaGithub /></SocialIcon>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/tickets">All Tickets</FooterLink>
              <FooterLink to="/dashboard">My Dashboard</FooterLink>
              <FooterLink to="/login">Login</FooterLink>
              <FooterLink to="/register">Register</FooterLink>
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms & Conditions</FooterLink>
              <FooterLink to="/help">Help Center</FooterLink>
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact & Payment</h4>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">📧</span>
                mernickets@gmail.com
              </p>
              <p className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">📞</span>
                +44 213512 7157
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">Secured by</p>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg inline-block shadow-sm">
                 <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Stripe"
                  className="h-6"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} <span className="font-semibold text-blue-600 dark:text-blue-400">TicketBari</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
             <a href="/privacy-policy" className="hover:text-blue-500 transition-colors">
             Privacy</a>
             <a href="/terms" className="hover:text-blue-500 transition-colors">
             Terms</a>
             <a href="/coming-soon" className="hover:text-blue-500 transition-colors">
             Cookies</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform"></span>
        <span className="group-hover:translate-x-1 transition-transform">{children}</span>
      </Link>
    </li>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="
        w-10 h-10 flex items-center justify-center rounded-xl
        bg-gray-100 text-gray-600
        hover:bg-linear-to-tr hover:from-blue-600 hover:to-cyan-400 hover:text-white hover:shadow-lg hover:shadow-blue-500/30
        dark:bg-gray-800 dark:text-gray-400
        dark:hover:text-white
        transition-all duration-300
      "
    >
      <span className="text-lg">{children}</span>
    </motion.a>
  );
}