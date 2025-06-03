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

export const authenticateOwner=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const serverId=Number(req.query.id);
    const {id}=res.locals;

    if (!serverId) {
      res.status(400).json({
        success: false,
        message: "Invalid server ID format"
      });
      return;
    }

    try{
        const server=await prisma.server.findFirst({
            where:{id:serverId}
        });

        if(!server){
            res.status(400).json({
                success:false,
                message:"Invalid Server ID."
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

        next();
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
        return;
    }
}