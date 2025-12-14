// src/utils/axiosSecure.js
import axios from "axios";
const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api" });

axiosSecure.interceptors.request.use(config=>{
  const token = localStorage.getItem("mernickets_token");
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosSecure;