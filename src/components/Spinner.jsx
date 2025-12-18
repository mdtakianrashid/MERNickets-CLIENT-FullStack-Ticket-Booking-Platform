// src/components/Spinner.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Spinner({ className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      
      {/* Container for the spinner layers */}
      <div className="relative w-16 h-16">
        
        {/* Layer 1: Main Gradient Ring (Blue/Cyan) - Fast Spin */}
        <motion.span
          className="absolute inset-0 block w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-cyan-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 2: Inner Ring (Yellow/Blue) - Slow Reverse Spin */}
        <motion.span
          className="absolute top-2 left-2 block w-12 h-12 border-4 border-transparent border-b-yellow-400 border-l-blue-500 rounded-full opacity-70"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 3: Center Pulsing Dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
      </div>

      {/* Optional Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="mt-4 text-sm font-semibold text-blue-600 dark:text-cyan-400 tracking-widest uppercase"
      >
        Loading
      </motion.p>
    </div>
  );
}