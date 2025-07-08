// lib/api/axiosInstance.ts
import axios from "axios";

const ApiService = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default ApiService;
