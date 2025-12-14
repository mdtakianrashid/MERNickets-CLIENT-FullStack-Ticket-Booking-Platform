// src/pages/TicketDetails/TicketDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPublic from "../utils/axiosPublic";
import axiosSecure from "../utils/axiosSecure";
import Spinner from "../../components/Spinner";
import { useAuth } from "../hooks/useAuth";

function Countdown({ target }) {
  const [left, setLeft] = useState({});
  useEffect(()=>{
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
  return <div>{left.days}d {left.hours}h {left.mins}m {left.secs}s</div>;
}

export default function TicketDetails(){
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    setLoading(true);
    axiosPublic.get("/tickets")
      .then(res => {
        const t = (res.data || []).find(x => x._id === id);
        setTicket(t || null);
      })
      .catch(console.error)
      .finally(()=>setLoading(false));
  }, [id]);

  const canBook = ticket && ticket.departure && new Date(ticket.departure) > new Date() && ticket.ticketQuantity > 0;

  const handleBook = async ()=>{
    if(!user) return navigate("/login");
    if(qty < 1 || qty > (ticket.ticketQuantity || 0)) return alert("Invalid quantity");
    setBookingLoading(true);
    try {
      const res = await axiosSecure.post("/bookings", { ticketId: ticket._id, quantity: qty });
      // server returns booking
      navigate("/dashboard"); // user dashboard shows booking
    } catch(err){
      alert(err?.response?.data?.message || "Booking error");
    } finally { setBookingLoading(false); }
  };

  if(loading) return <Spinner />;
  if(!ticket) return <div>Ticket not found</div>;

  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={ticket.image || "/placeholder.jpg"} alt={ticket.title} className="w-full h-80 object-cover"/>
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="my-2">{ticket.description}</p>
          <p><strong>From:</strong> {ticket.from} — <strong>To:</strong> {ticket.to}</p>
          <p><strong>Transport:</strong> {ticket.transportType}</p>
          <p><strong>Price:</strong> ${ticket.price}</p>
          <p><strong>Seats left:</strong> {ticket.ticketQuantity}</p>
          <div className="mt-4">
            <Countdown target={ticket.departure} />
          </div>

          <div className="mt-6">
            <input type="number" className="input w-32" min={1} max={ticket.ticketQuantity} value={qty} onChange={e=>setQty(Number(e.target.value))} />
            <button className="btn ml-3" onClick={handleBook} disabled={!canBook || bookingLoading}>
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
            {!canBook && <div className="text-red-600 mt-2">Cannot book (past departure or sold out)</div>}
          </div>
        </div>
      </div>
    </div>
  );
}