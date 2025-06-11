import axios from 'axios';

const BACKEND_ENDPOINT_URL=process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_URL || "http://15.207.20.226:5000";

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_ENDPOINT_URL}/api`, 
  withCredentials: true, 
});