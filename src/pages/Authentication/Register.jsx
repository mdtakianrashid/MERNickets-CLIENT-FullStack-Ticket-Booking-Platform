import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function validatePassword(pw) {
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const longEnough = pw.length >= 6;
  return hasUpper && hasLower && longEnough;
}

export default function Register() {
  const { registerUser } = useAuth();      // FIXED NAME
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      return toast.error('Password must have upper, lower and at least 6 chars');
    }
    setSubmitting(true);
    try {
      await registerUser({ name, email, photoURL: photo, password });   // FIXED NAME
      toast.success('Registered');
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Register failed';
      toast.error(msg);
      console.error("Register form error:", err?.response || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="input w-full" required />
        <input value={photo} onChange={e=>setPhoto(e.target.value)} placeholder="Photo URL" className="input w-full" />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input w-full" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="input w-full" required />
        <button className="btn w-full" disabled={submitting}>{submitting ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
}