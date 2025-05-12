import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

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
        const decoded=jwt.verify(token,process.env.JWT_PASS as string) as Prisma.UserCreateInput;
        res.locals.userType=decoded.type;
        
        next();
    }catch(e){
        res.status(401).json({
            success:false,
            message:"Invlaid or expired token."
        })
        return;
    }
}