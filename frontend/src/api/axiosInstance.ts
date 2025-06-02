import axios from 'axios';

const BACKEND_ENDPOINT_URL=process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_URL || "http://localhost:5000";

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_ENDPOINT_URL}/api`, 
  withCredentials: true, 
});