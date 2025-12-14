// src/context/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import axiosPublic from "../utils/axiosPublic";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const AuthContext = createContext();

export default function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist Firebase auth state
  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(async (u)=>{
      setUser(u);
      setLoading(false);
      if(u && u.email){
        // create user on server (idempotent)
        try { await axiosPublic.post("/auth/register", { name: u.displayName || "", email: u.email, role: "user" }); } catch(e){/*ignore*/}

        // get JWT from server
        try {
          const { data } = await axiosPublic.post("/auth/jwt", { email: u.email });
          if(data?.token) localStorage.setItem("mernickets_token", data.token);
        } catch(err){ console.error("JWT error", err?.response?.data || err.message); }
      } else {
        localStorage.removeItem("mernickets_token");
      }
    });
    return ()=>unsub();
  }, []);

  const register = async ({ name, email, password, photoURL })=>{
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL: photoURL || "" });
    setLoading(false);
    return res.user;
  };

  const login = async ({ email, password })=>{
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
    return res.user;
  };

  const loginWithGoogle = async ()=>{
    setLoading(true);
    const res = await signInWithPopup(auth, provider);
    setLoading(false);
    return res.user;
  };

  const logout = async ()=> { setLoading(true); await signOut(auth); setLoading(false); };

  return <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
}