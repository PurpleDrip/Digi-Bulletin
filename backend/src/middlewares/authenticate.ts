import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma";

export const authenticateUser=(req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies?.DigiBulletinCookie;

    if(!token){
        res.status(403).json({
            success:false,
            message:"No tokens found."
        })
        return;
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_PASS as string) as CookieType;
        res.locals=decoded;
        
        next();
    }catch(e){
        res.status(401).json({
            success:false,
            message:"Invlaid or expired token."
        })
        return;
    }
}

export const authenticateOwner=async (req:Request,res:Response,next:NextFunction)=>{

    const {id}=res.locals;
    const {serverName}=req.body;

    try{
        const server=await prisma.server.findFirst({
            where:{name:serverName}
        });

        if(!server){
            res.status(400).json({
                success:false,
                message:"Server Name not found."
            })
            return; 
        }

        if(server?.ownerId!==id){
            res.status(403).json({
                success:false,
                message:"Only the Owner can alter the configurations of the server."
            })
            return;
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
        return;
    }
}