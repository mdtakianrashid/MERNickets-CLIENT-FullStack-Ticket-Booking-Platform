// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound(){
  return (
    <div className="container mx-auto text-center py-16">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">Page not found</p>
      <Link to="/" className="btn mt-6 inline-block">Go to Home</Link>
    </div>
  );
}