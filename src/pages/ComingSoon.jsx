import { motion } from "framer-motion";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full text-center bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-linear-to-tr from-blue-600 to-cyan-400 text-white shadow-lg">
            <WrenchScrewdriverIcon className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          Page Under Development
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          This page is currently under development and will be available very
          soon. We’re working hard to bring you a great experience.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl
          bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold
          shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}