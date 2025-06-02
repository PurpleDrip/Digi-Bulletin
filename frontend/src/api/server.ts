import { axiosInstance } from "./axiosInstance"

export const createServer=(data:any)=>{
    return axiosInstance.post("/server/create-server",data)
}

export const deleteServer=(id:number)=>{
    return axiosInstance.delete(`/server/delete-server?id=${id}`)
}