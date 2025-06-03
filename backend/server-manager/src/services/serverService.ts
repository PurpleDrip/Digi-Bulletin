import { Prisma } from "@prisma/client";


import prisma from "../lib/prisma";
import { ServiceError } from "../types/ServiceError";

const createServer=async (data:Prisma.ServerCreateInput): Promise<ServiceError> =>{

    try{
        const existingServer=await prisma.server.findFirst({
            where:{
                name:data.name,
            }
        });
        if(existingServer){
            return {
                status:400,
                message:"Server already exists",
            };
        }

    }catch(err){
        console.error("Error creating server:", err);
        return {
            status:500,
            message:"Error creating server",
        };
    }

    try{
        await prisma.server.create({
            data
        })

        return {
            status:200,
            message:"Server created successfully",
        };
    }catch(err){
        console.error("Error creating server:", err);
        return {
            status:500,
            message:"Error creating server",
        };
    }
}

const createServerwithAudience=async(server:Prisma.ServerCreateInput,audience:Prisma.AudienceCreateInput):Promise<ServiceError>=>{
    try{
        const existingServer=await prisma.server.findFirst({
            where:{
                name:server.name,
            }
        });
        if(existingServer){
            return {
                status:400,
                message:"Server already exists",
            };
        }

    }catch(err){
        console.error("Error creating server:", err);
        return {
            status:500,
            message:"Error creating server",
        };
    }

    try{

        await prisma.$transaction(async (tx) => {
            const aud = await tx.audience.create({
              data: audience,
            });
          
            await tx.server.create({
              data: {
                ...server,
                audience: {
                  connect: { id: aud.id },
                },
              },
            });
          });

        return {
            status:200,
            message:"Server created successfully",
        };
          
    }catch(err){
        console.error("Error creating server:", err);
        return {
            status:500,
            message:"Error creating server",
        };
    }
}

const createServerwithAudiencebyId=async(server:Prisma.ServerCreateInput,audienceId:number):Promise<ServiceError>=>{
    try{
        const existingServer=await prisma.server.findFirst({
            where:{
                name:server.name,
            }
        });
        if(existingServer){
            return {
                status:400,
                message:"Server already exists",
            };
        }

        const existingAudience=await prisma.audience.findFirst({
            where:{
                id:audienceId,
            }
        });
        if(!existingAudience){
            return {
                status:400,
                message:"Audience does not exist",
            };
        }

    }catch(err){
        console.error("Error creating server:", err);
        return {
            status:500,
            message:"Error creating server",
        };
    }

    try{

        await prisma.server.create({
            data: {
            ...server,
            audience: {
                connect: { id: audienceId },
            },
            },
        });

        return {
            status:200,
            message:"Server created successfully",
        };
          
    }catch(err){
        console.error("Error creating server:", err);
        return {
            status:500,
            message:"Error creating server",
        };
    }
}

export {
    createServer,
    createServerwithAudience,
    createServerwithAudiencebyId,
}