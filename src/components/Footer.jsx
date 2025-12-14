// src/components/Footer.jsx
import React from "react";

export default function Footer(){
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-8">
      <div className="container mx-auto py-8 px-4 grid md:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-blue-600 text-white rounded-full p-2">🚌</span>
            <span>TicketBari</span>
          </div>
          <p className="mt-2 text-sm">Book bus, train, launch & flight tickets easily</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/tickets" className="hover:underline">All Tickets</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact Info</h4>
          <p className="text-sm">Email: alevelcrashcourses@gmail.com</p>
          <p className="text-sm">Phone: +44 7517 215312</p>
          <p className="text-sm mt-2"><a href="https://facebook.com" className="hover:underline">Facebook Page</a></p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Payment Methods</h4>
          <p className="text-sm">Stripe</p>
          <div className="mt-3">
            <img src="/payment-icons/stripe.svg" alt="stripe" className="h-8"/>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 text-center py-3 text-sm">
        © 2025 TicketBari. All rights reserved.
      </div>
    </footer>
  );
}