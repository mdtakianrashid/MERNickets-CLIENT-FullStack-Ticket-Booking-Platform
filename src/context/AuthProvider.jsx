// src/context/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import axiosPublic from "../utils/axiosPublic";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================================
     Auth State Observer
  ================================ */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (u?.email) {
        try {
          // 🔐 Get JWT
          const jwtRes = await axiosPublic.post("/auth/jwt", {
            email: u.email,
          });
          localStorage.setItem("mernickets_token", jwtRes.data.token);

          // 👤 Get DB user
          const { data } = await axiosPublic.get(
            `/auth/me?email=${u.email}`
          );
          setDbUser(data);
        } catch (error) {
          console.error("AuthProvider error:", error);
          setDbUser(null);
        }
      } else {
        setDbUser(null);
        localStorage.removeItem("mernickets_token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================================
     Register (EMAIL / PASSWORD)
  ================================ */
  const register = async ({ name, email, password, photoURL }) => {
    setLoading(true);

    // 1️⃣ Create Firebase user
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2️⃣ Update Firebase profile
    await updateProfile(res.user, {
      displayName: name,
      photoURL: photoURL || "",
    });

    // 3️⃣ Create user in MongoDB WITH NAME (CRITICAL FIX)
    await axiosPublic.post("/auth/register", {
      email,
      name,
    });

    setLoading(false);
    return res.user;
  };

  /* ================================
     Login
  ================================ */
  const login = async ({ email, password }) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
    return res.user;
  };

  /* ================================
     Google Login
  ================================ */
  const loginWithGoogle = async () => {
    setLoading(true);
    const res = await signInWithPopup(auth, provider);

    // Ensure Google users exist in DB
    await axiosPublic.post("/auth/register", {
      email: res.user.email,
      name: res.user.displayName,
    });

    setLoading(false);
    return res.user;
  };

  /* ================================
     Logout
  ================================ */
  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    localStorage.removeItem("mernickets_token");
    setDbUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}