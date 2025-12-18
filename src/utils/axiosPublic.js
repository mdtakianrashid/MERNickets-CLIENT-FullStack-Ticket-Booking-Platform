import axios from "axios";
const axiosPublic = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "https://mernickets-server.vercel.app/api" });
export default axiosPublic;