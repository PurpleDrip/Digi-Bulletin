import { Prisma } from "@prisma/client";


import prisma from "../lib/prisma";
import { ServiceError } from "../types/ServiceError";

const addUser=async (data: Prisma.UserCreateInput): Promise<ServiceError> =>{

    //TODO: validate input
    //TODO: check if USN exists in MSRIT database

    try{
        const existingUser=await prisma.user.findUnique({
            where:{
                usn:data.usn,
            }
        });

        if(existingUser){
            return {
                status:400,
                message:"User already exists",
            };
        }
    }catch(err){
        return {
            status:500,
            message:"Error checking user",
        };
    }


    try{
        await prisma.user.create({
            data
        })

        return {
            status:200,
            message:"User created successfully",
        };
    }catch(err){
        console.error("Error creating user:", err);
        return {
            status:500,
            message:"Error creating user",
        };
    }
}

const getUserbyUSN=async (usn:string):Promise<ServiceError| Prisma.UserCreateInput>=>{

    try{
        const user=await prisma.user.findUnique({
            where:{
                usn,
            }
        });

        if(!user){
            return {
                status:404,
                message:"User not found",
            };
        }

        return (user)
    }catch(err){
        console.error("Error fetching user:", err);
        return {
            status:500,
            message:"Error fetching user",
        };
    }
}

const getUserbyName=async (name:string):Promise<ServiceError | Prisma.UserCreateInput>=>{

    try{
        const user=await prisma.user.findFirst({
            where:{
                name,
            }
        });

        if(!user){
            return {
                status:404,
                message:"User not found",
            };
        }

        return (user)
    }catch(err){
        console.error("Error fetching user:", err);
        return {
            status:500,
            message:"Error fetching user",
        };
    }
}

const getUserbyId=async (id:number):Promise<ServiceError | Prisma.UserCreateInput>=>{

    try{
        const user=await prisma.user.findUnique({
            where:{
                id,
            }
        });

        if(!user){
            return {
                status:404,
                message:"User not found",
            };
        }

        return (user)
    }catch(err){
        console.error("Error fetching user:", err);
        return {
            status:500,
            message:"Error fetching user",
        };
    }
}

const deleteUser=async (id:number):Promise<ServiceError| Prisma.UserCreateInput>=>{
    try{
        const user=await prisma.user.delete({
            where:{
                id,
            }
        });

        if(!user){
            return {
                status:404,
                message:"User not found",
            };
        }

        return (user)
    }catch(err){
        console.error("Error fetching user:", err);
        return {
            status:500,
            message:"Error fetching user",
        };
    }
}

export {addUser,getUserbyUSN,getUserbyName,getUserbyId,deleteUser}