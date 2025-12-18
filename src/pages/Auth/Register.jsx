// src/pages/Auth/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  PhotoIcon, 
  TicketIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function Register() {
  const { register } = useAuth();
  
  // State
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Local error state for better UI feedback

  const navigate = useNavigate();

  // Password Validation Logic [cite: 66]
  const validatePassword = (p) => {
    if (p.length < 6) return "Password must be at least 6 characters"; // [cite: 70]
    if (!/[A-Z]/.test(p)) return "Must contain an uppercase letter"; // [cite: 68]
    if (!/[a-z]/.test(p)) return "Must contain a lowercase letter"; // [cite: 69]
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // 1. Validate Password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError); // Show error in UI
      return; // Stop execution 
    }

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    setLoading(true);
    try {
      await register({ name, email, password, photoURL });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  // Full page loading spinner
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Spinner /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor (Blobs) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten opacity-70 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 dark:border-gray-700">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 text-white mb-4 shadow-lg shadow-blue-500/30">
              <TicketIcon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Join MERNickets today!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                  placeholder="John Doe"
                  value={name}
                  onChange={e=>setName(e.target.value)}
                />
              </div>
            </div>

            {/* Photo URL Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Photo URL <span className="text-xs text-gray-400 font-normal">(Optional)</span></label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhotoIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                  placeholder="https://example.com/avatar.jpg"
                  value={photoURL}
                  onChange={e=>setPhotoURL(e.target.value)}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all sm:text-sm ${
                    error ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                />
                 {/* Toggle Button */}
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Validation Requirements Help Text */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                Must contain 1 uppercase, 1 lowercase & min 6 chars.
              </p>

              {/* Error Message Display */}
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-red-500 font-medium ml-1"
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Creating Account..." : "Register"}
            </motion.button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Login here
                </Link>
              </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}