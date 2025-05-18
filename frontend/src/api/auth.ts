import { axiosInstance } from "./axiosInstance";

export const checkforcookies=async ()=>{
    return await axiosInstance.get('/auth/checkforcookies');
}