import axios from "axios";
const axiosPublic = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "https://mer-nickets-server-full-stack-ticke.vercel.app/api" });
export default axiosPublic;