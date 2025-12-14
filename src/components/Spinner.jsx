// src/components/Spinner.jsx
import React from "react";

export default function Spinner(){
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}