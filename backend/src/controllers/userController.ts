import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs"

export const registerUser=async (req:Request,res:Response):Promise<void> =>{
    const data=res.locals.data;

    try{

        const [existingUserByUsn, existingUserByPhone] = await Promise.all([
            prisma.user.findUnique({ where: { usn: data.usn } }),
            prisma.user.findUnique({ where: { phoneNumber: data.phoneNumber } })
          ]);
          
          if (existingUserByUsn || existingUserByPhone) {
            res.status(400).json({
              success: false,
              message: existingUserByUsn ? "The provided USN is already in use." : "The provided phone number is already in use."
            });
            return;
        }
          
        const encryptedPassword= await bcrypt.hash(data.password,parseInt(process.env.SALT as string,10));

        await prisma.user.create({
            data:{
                ...data,
                password:encryptedPassword,
            }
        })

        res.status(201).json({
            success:true,
            message:`Account details is sent to the ADMIN, you will receive an confirmation SMS soon.`
        })
        return;
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Internal Sever Error"
        })
        return;
    }
}

export const getPendingAcc=async (req:Request,res:Response): Promise<void> =>{
    const user=res.locals.userType;

    if(!user || user!=="ADMIN"){
        res.status(403).json({
            success:false,
            message:"Only admin can perform this action."
        })
        return;
    }

    try{
        const pendingAcc=await prisma.user.findMany({
            where:{status:"pending"},
        });

        res.status(200).json({
            success:true,
            data:pendingAcc
        })
        return;

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:"Error fetching the Users."
        })
        return;
    }
}