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

  // REGISTER
  const registerUser = async ({ name, email, photoURL, password }) => {
    const trimmedEmail = String(email || '').trim();
    const trimmedPassword = String(password || '');
    const trimmedName = String(name || '').trim();
    const trimmedPhoto = photoURL ? String(photoURL).trim() : '';

    console.log("AuthProvider.registerUser called with:", {
      trimmedName,
      trimmedEmail,
      trimmedPhoto,
    });

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      await updateProfile(cred.user, {
        displayName: trimmedName || undefined,
        photoURL: trimmedPhoto || undefined,
      });

      const payload = {
        name: trimmedName || "No Name",
        email: trimmedEmail,
        photo: trimmedPhoto || "",
      };

      const res = await axiosPublic.post("/users", payload);

      if (!res || !res.data) {
        throw new Error("Failed to save user on backend");
      }

      setUser(cred.user);
      toast.success("Registration successful");
      return res.data;
    } catch (err) {
      const firebaseCode = err?.code;
      const firebaseMessage = err?.message;

      const userMessage =
        err?.response?.data?.message ||
        (firebaseCode ? `${firebaseCode}: ${firebaseMessage}` : null) ||
        err?.message ||
        "Registration failed";

      const e = new Error(userMessage);
      e.original = err;
      throw e;
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
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

      const payload = {
        name: u.displayName || "No Name",
        email: u.email,
        photo: u.photoURL || "",
      };

      const res = await axiosPublic.post("/users", payload);
      if (!res || !res.data) throw new Error("Failed to save Google user");

      setUser(u);
      return res.data;
    } catch (err) {
      console.error("Google login error:", err);
      throw err;
    }
  };

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
        registerUser,   // FIXED NAME
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};