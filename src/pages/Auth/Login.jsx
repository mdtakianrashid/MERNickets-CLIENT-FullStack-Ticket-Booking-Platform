// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login(){
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      alert(err.message || "Login failed");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      alert(err?.message || "Google sign-in failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto max-w-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4 card p-4">
        <div>
          <label className="block text-sm">Email</label>
          <input className="input w-full" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input className="input w-full" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          <Link to="/register" className="text-sm">Create account</Link>
        </div>

        <div className="text-center">
          <button type="button" className="btn-outline mt-2" onClick={handleGoogle} disabled={loading}>Sign in with Google</button>
        </div>
      </form>
    </div>
  );
}