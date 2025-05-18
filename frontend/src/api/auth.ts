import { axiosInstance } from "./axiosInstance";

export const checkforcookies= ()=>{
    return axiosInstance.get('/auth/checkforcookies');
}

export const sendotp=(phoneNumber:string)=>{
    return axiosInstance.post('/auth/send-otp', {
        phoneNumber: phoneNumber
    });
}

export const loginUser=(data:{
    usn:string,
    password:string,
    phoneNumber:string,
    otp:string,
})=>{
    return axiosInstance.post('/user/login-user',data);
}