import { axiosInstance } from "./axiosInstance";

export const checkforcookies= ()=>{
    return axiosInstance.get('/auth/checkforcookies');
}

export const sendotp=(phoneNumber:string,usn?:string,registerAttempt?:boolean)=>{
    return axiosInstance.post('/auth/send-otp', {phoneNumber,usn,registerAttempt});
}

export const loginUser=(data:{
    usn:string,
    password:string,
    phoneNumber:string,
    otp:string,
})=>{
    return axiosInstance.post('/user/login-user',data);
}

export const registerUser=(data:{
    usn:string,
    name:string,
    password:string,
    phoneNumber:string,
    otp:string,
    department: string,
    year: number,
    semester: number,
    yearOfAdmission: string,
    section: string,
})=>{
    return axiosInstance.post('/user/register-user',data);
}