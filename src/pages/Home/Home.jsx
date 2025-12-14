// src/pages/Home/Home.jsx
import React, { useEffect, useState } from "react";
import axiosPublic from "../utils/axiosPublic";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";

export default function Home(){
  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    axiosPublic.get("/tickets")
      .then(res => {
        const all = res.data || [];
        setAdvertised(all.filter(t => t.advertised).slice(0,6));
        // Latest: sort by createdAt or date field if present
        const sorted = all.slice().sort((a,b)=> new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
        setLatest(sorted.slice(0,8));
      })
      .catch(console.error)
      .finally(()=>setLoading(false));
  },[]);

  if(loading) return <Spinner />;

  return (
    <div className="container mx-auto">
      <section className="hero py-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl font-bold">Find & Book Your Next Journey</h1>
            <p className="mt-3 text-lg">Search bus, train, launch & flight tickets. Fast, secure, and reliable.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/tickets" className="btn">Browse Tickets</Link>
            </div>
          </div>
          <div>
            <img src="/hero.jpg" alt="hero" className="w-full rounded shadow" />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Advertisement</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {advertised.map(t => (
            <div key={t._id} className="card p-3">
              <img src={t.image || "/placeholder.jpg"} alt={t.title} className="w-full h-44 object-cover mb-2"/>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm">{t.from} → {t.to}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="font-bold">${t.price}</div>
                <Link to={`/ticket/${t._id}`} className="btn">See details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Latest Tickets</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {latest.map(t => (
            <div key={t._id} className="card p-3">
              <img src={t.image || "/placeholder.jpg"} alt={t.title} className="w-full h-36 object-cover mb-2" />
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm">{t.from} → {t.to}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="font-bold">${t.price}</div>
                <Link to={`/ticket/${t._id}`} className="btn">Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}