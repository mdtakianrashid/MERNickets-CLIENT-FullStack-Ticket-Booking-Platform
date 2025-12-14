// src/pages/Dashboard/MyBookings.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";

function Countdown({ target }) {
  const [left, setLeft] = useState({});
  useEffect(()=>{
    if(!target) return;
    const tick = ()=>{
      const diff = new Date(target) - new Date();
      if(diff<=0){ setLeft(null); return;}
      const days = Math.floor(diff/(1000*60*60*24));
      const hours = Math.floor((diff/(1000*60*60))%24);
      const mins = Math.floor((diff/(1000*60))%60);
      const secs = Math.floor((diff/1000)%60);
      setLeft({ days, hours, mins, secs });
    };
    tick(); const id = setInterval(tick, 1000);
    return ()=>clearInterval(id);
  }, [target]);

  if(left === null) return <div>Departure passed</div>;
  if(!left) return null;
  return <div className="text-sm">{left.days}d {left.hours}h {left.mins}m {left.secs}s</div>;
}

export default function MyBookings(){
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    axiosSecure.get("/bookings")
      .then(res => setBookings(res.data || []))
      .catch(err => console.error(err))
      .finally(()=>setLoading(false));
  },[]);

  if(loading) return <Spinner />;

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Booked Tickets</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {bookings.map(b => (
          <div key={b._id} className="card p-4">
            <img src={b.image || "/placeholder.jpg"} alt={b.ticketTitle || "ticket"} className="w-full h-36 object-cover mb-2" />
            <h3 className="font-semibold">{b.ticketTitle}</h3>
            <p className="text-sm">{b.quantity} × ${b.totalPrice && b.quantity ? (b.totalPrice / b.quantity).toFixed(2) : b.totalPrice}</p>
            <p className="text-sm">{b.status} {b.paid ? "(Paid)" : ""}</p>
            <div className="mt-2">
              <Countdown target={b.departure} />
            </div>
            <div className="mt-3 flex gap-2">
              {b.status === "accepted" && !b.paid && new Date(b.departure) > new Date() && (
                <Link to={`/payment/${b._id}`} className="btn">Pay Now</Link>
              )}
              <button className="btn-outline">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}