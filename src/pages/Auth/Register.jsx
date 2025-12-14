// src/pages/Auth/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register(){
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (p) => {
    if (p.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(p)) return "Must contain an uppercase letter";
    if (!/[a-z]/.test(p)) return "Must contain a lowercase letter";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validatePassword(password);
    if(err) return alert(err);

    setLoading(true);
    try {
      await register({ name, email, password, photoURL });
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.message || "Register failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto max-w-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4 card p-4">
        <div>
          <label className="block text-sm">Name</label>
          <input className="input w-full" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Photo URL (optional)</label>
          <input className="input w-full" value={photoURL} onChange={e=>setPhotoURL(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input className="input w-full" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input className="input w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  );
}