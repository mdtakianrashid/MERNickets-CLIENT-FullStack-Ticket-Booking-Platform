# 🎟️ MERNickets - Modern Full Stack Online Ticket Booking Platform

**MERNickets** is a premium, full-stack online ticket booking platform built with the MERN stack (MongoDB, Express, React, Node.js). It serves as a comprehensive travel hub where users can discover and book tickets for buses, trains, launches, and flights.

The platform features a sleek, glassmorphic UI with **Dark/Light mode**, advanced role-based dashboards (User, Vendor, Admin), real-time booking status updates, and secure payments via Stripe.

---

## 🌐 Live Demo

### 🔗 Client  
**[https://mernickets.netlify.app/]**

### 🔗 Server  
**[https://mernickets-server.vercel.app/]**

---

## 🔑 Test Credentials

Use these credentials to explore the different role-based features:

### 👮‍♂️ Admin Access
> **Email:** `[admin@mernickets.com]`  
> **Password:** `[Ab1234567890]`

### 🏪 Vendor Access
> **Email:** `[vendor@mernickets.com]`  
> **Password:** `[Ab1234567890]`

### 👤 User Access
> **Email:** `[Login with Any Email/Gmail]`  

---

## ✨ Key Features

### 🌍 General Features
**Modern UI/UX:** Built with **Tailwind CSS v4** and **Framer Motion** for smooth page transitions and glassmorphism effects[cite: 19].
**Responsive Design:** Fully optimized layout for mobile, tablet, and desktop screens[cite: 33].
**Theme Toggle:** Integrated Dark/Light mode toggle for better user experience[cite: 251].
**Secure Authentication:** Firebase Email/Password login and Google Social Login[cite: 46].

### 👤 User Features (Traveler)
**Advanced Search & Filter:** Search tickets by Location (From/To) and filter by Transport Type (Bus, Train, Launch, Flight)[cite: 247].
**Smart Sorting:** Sort tickets by Price (Low to High / High to Low)[cite: 248].
* **Booking System:** Book tickets with a real-time quantity selector.
**Secure Payments:** Integrated **Stripe** payment gateway for secure transactions[cite: 139].
* **User Dashboard:**
    **My Bookings:** View booking status (Pending, Accepted, Rejected) with a countdown timer for upcoming trips[cite: 128].
    **Transaction History:** View detailed payment logs with transaction IDs[cite: 144].

### 🏪 Vendor Features (Service Provider)
**Ticket Management:** Add, Update, and Delete ticket listings with image uploads[cite: 158, 179].
**Booking Requests:** Accept or Reject incoming booking requests from users[cite: 182].
**Revenue Analytics:** Interactive charts (Bar & Pie) displaying "Total Revenue", "Tickets Sold", and "Tickets Added" using **Recharts**[cite: 190].
**Inventory Control:** Track ticket verification status (Pending, Approved, Rejected)[cite: 175].

### 🛡️ Admin Features (Platform Manager)
**Ticket Moderation:** Approve or Reject tickets added by vendors before they go live[cite: 199].
**User Management:** Manage user roles (Promote to Vendor/Admin) and mark fraudulent vendors[cite: 204].
**Advertisement Control:** Toggle "Featured" status for tickets to display them on the Home page banner (Max 6)[cite: 210].
**System Overview:** centralized control over the entire platform's content.

---

## 🛠️ Tech Stack

### **Frontend**
* **React 19** (Vite)
* **Tailwind CSS v4** (Styling)
* **Framer Motion** (Animations)
* **Recharts** (Data Visualization)
* **Stripe.js** (Payments)

### **Backend**
* **Node.js** (Runtime)
* **Express.js** (Framework)
* **MongoDB** (Database)
* [cite_start]**JWT** (Secure API Protection) [cite: 249]

### **Tools**
* **Firebase** (Authentication)
* [cite_start]**ImgBB** (Image Hosting) [cite: 167]

---

## 📦 Dependencies

```json
"dependencies": {
    "@heroicons/react": "^2.2.0",
    "@stripe/react-stripe-js": "^5.4.1",
    "@stripe/stripe-js": "^8.5.3",
    "@tailwindcss/vite": "^4.1.18",
    "axios": "^1.13.2",
    "firebase": "^12.6.0",
    "framer-motion": "^12.23.26",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hot-toast": "^2.6.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.10.1",
    "recharts": "^3.6.0"
}

## 🏃 Running Locally

Follow these steps to get a local copy up and running.

### 1. Clone the repository
```
git clone [https://github.com/mdtajrianrashid/MERNickets-CLIENT-FullStack-Ticket-Booking-Platform.git]
cd [MERNickets-CLIENT-FullStack-Ticket-Booking-Platform]
npm install 

Create a .env.local file in the root directory and add your keys:

VITE_apiKey=YOUR_FIREBASE_API_KEY
VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
VITE_projectId=YOUR_FIREBASE_PROJECT_ID
VITE_storageBucket=YOUR_FIREBASE_STORAGE_BUCKET
VITE_messagingSenderId=YOUR_FIREBASE_SENDER_ID
VITE_appId=YOUR_FIREBASE_APP_ID
VITE_stripe_publishable_key=YOUR_STRIPE_PK
VITE_API_URL=http://localhost:5000

npm run dev
```