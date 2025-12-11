import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import axiosPublic from "../api/axiosPublic";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(true);

      if (currentUser?.email) {
        try {
          // 1) Request JWT from backend
          const res = await axiosPublic.post("/auth/jwt", {
            email: currentUser.email,
          });
          const token = res?.data?.token;
          if (token) {
            localStorage.setItem("mToken", token);
          } else {
            console.warn("No token received for", currentUser.email, res?.data);
            localStorage.removeItem("mToken");
          }

          // 2) Fetch role (optional)
          try {
            const userRes = await axiosPublic.get(
              `/users?email=${encodeURIComponent(currentUser.email)}`
            );
            const role = userRes.data?.role || "user";
            localStorage.setItem("mRole", role);
          } catch (err) {
            console.error("Role fetch error:", err?.response || err);
            localStorage.setItem("mRole", "user");
          }
        } catch (err) {
          console.error("JWT error:", err?.response || err);
          localStorage.removeItem("mToken");
          localStorage.removeItem("mRole");
        }
      } else {
        localStorage.removeItem("mToken");
        localStorage.removeItem("mRole");
      }

      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

    // REGISTER - create Firebase user, update profile, then upsert to backend
  const register = async ({ name, email, photoURL, password }) => {
    // defensive trim
    const trimmedEmail = String(email || '').trim();
    const trimmedPassword = String(password || '');
    const trimmedName = String(name || '').trim();
    const trimmedPhoto = photoURL ? String(photoURL).trim() : '';

    console.log("AuthProvider.register called with:", { trimmedName, trimmedEmail, trimmedPhoto });

    try {
      // Create Firebase user
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      console.log("Firebase createUserWithEmailAndPassword success:", cred.user?.uid);

      // update displayName / photo in Firebase profile
      await updateProfile(cred.user, {
        displayName: trimmedName || undefined,
        photoURL: trimmedPhoto || undefined,
      });
      console.log("Firebase updateProfile done for:", cred.user?.email);

      // Upsert user in our Mongo backend
      const payload = { name: trimmedName || 'No Name', email: trimmedEmail, photo: trimmedPhoto || "" };
      console.log("Posting to backend /users with payload:", payload);

      const res = await axiosPublic.post("/users", payload);
      console.log("Backend /users response:", res?.status, res?.data);

      if (!res || !res.data) {
        console.warn("Backend /users returned unexpected response:", res);
        throw new Error("Failed to save user on backend");
      }

      // update local user state
      setUser(cred.user);

      toast.success("Registration successful");
      return res.data;
    } catch (err) {
      // Normalize firebase errors
      const firebaseCode = err?.code;
      const firebaseMessage = err?.message;
      console.error("Register error:", { firebaseCode, firebaseMessage, err });

      // Friendly UI error
      const userMessage =
        err?.response?.data?.message // backend message
        || (firebaseCode ? `${firebaseCode}: ${firebaseMessage}` : null)
        || err?.message
        || "Registration failed";

      // Re-throw an Error instance with message so the form can display it
      const e = new Error(userMessage);
      e.original = err;
      throw e;
    }
  };


  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const u = result.user;

      // Upsert user in backend (important: wait for server success)
      const payload = {
        name: u.displayName || "No Name",
        email: u.email,
        photo: u.photoURL || "",
      };

      const res = await axiosPublic.post("/users", payload);
      if (!res || !res.data) {
        console.warn("Backend /users returned unexpected response:", res);
        throw new Error("Failed to save Google user on backend");
      }

      // optionally set user immediately
      setUser(u);

      return res.data;
    } catch (err) {
      console.error("Google login error:", err?.response || err);
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      localStorage.removeItem("mToken");
      localStorage.removeItem("mRole");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingAuth,
        register,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};