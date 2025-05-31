import { axiosInstance } from "./axiosInstance"

export const createServer=(data:any)=>{
    return axiosInstance.post("/server/create-server",data)
}