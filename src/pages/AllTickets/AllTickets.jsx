// src/pages/AllTickets/AllTickets.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosPublic from "../utils/axiosPublic";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";

export default function AllTickets(){
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  // UI controls
  const [queryFrom, setQueryFrom] = useState("");
  const [queryTo, setQueryTo] = useState("");
  const [transport, setTransport] = useState("");
  const [sort, setSort] = useState(""); // price_asc, price_desc
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(()=>{
    setLoading(true);
    axiosPublic.get("/tickets")
      .then(res => setTickets(res.data || []))
      .catch(err => console.error(err))
      .finally(()=>setLoading(false));
  },[]);

  const filtered = useMemo(()=>{
    let arr = [...tickets];
    if(queryFrom) arr = arr.filter(t => (t.from || "").toLowerCase().includes(queryFrom.toLowerCase()));
    if(queryTo) arr = arr.filter(t => (t.to || "").toLowerCase().includes(queryTo.toLowerCase()));
    if(transport) arr = arr.filter(t => (t.transportType || "").toLowerCase() === transport.toLowerCase());
    if(sort === "price_asc") arr.sort((a,b)=>a.price - b.price);
    if(sort === "price_desc") arr.sort((a,b)=>b.price - a.price);
    return arr;
  }, [tickets, queryFrom, queryTo, transport, sort]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page-1)*perPage, page*perPage);

  if(loading) return <Spinner />;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Tickets</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input value={queryFrom} onChange={e=>setQueryFrom(e.target.value)} placeholder="From (location)" className="input" />
        <input value={queryTo} onChange={e=>setQueryTo(e.target.value)} placeholder="To (location)" className="input" />
        <select value={transport} onChange={e=>setTransport(e.target.value)} className="input">
          <option value="">All Transport Types</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="launch">Launch</option>
          <option value="plane">Plane</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>{total} tickets</div>
        <div className="flex gap-2 items-center">
          <label className="text-sm">Sort:</label>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="input">
            <option value="">Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {paginated.map(t => (
          <div key={t._id} className="card p-4 shadow">
            <img src={t.image || "/placeholder.jpg"} alt={t.title} className="w-full h-40 object-cover mb-3"/>
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm">{t.from} → {t.to}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="text-lg font-bold">${t.price}</div>
              <Link to={`/ticket/${t._id}`} className="btn">See details</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center gap-2">
        <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</button>
      </div>
    </div>
  );
}