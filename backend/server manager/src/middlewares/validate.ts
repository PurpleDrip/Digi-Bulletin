import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs"

import decodeUSN from "../utils/decodeUSN";
import getUserType from "../utils/getUserType";
import { userSchema, usnSchema } from "../schemas/zodSchema";
import prisma from "../lib/prisma";
import { z } from "zod";

export const validateRegisterUserInput=(req:Request,res:Response,next:NextFunction):void=>{

    const {usn,name,phoneNumber,password,year,section,semester}=req.body;

    const result=usnSchema.safeParse(usn);

    if (!result.success) {
        console.log("USN Validation Failed", result.error);
        res.status(400).json({ 
            message:"Validation Failed",
            error: result.error.flatten() })
        return;
    }

    // const extraStudentInfo=z.object({
    //     year: z.number().optional(),
    //     semester: z.number().min(1).max(8).optional(),
    //     section:z.enum(["A","B","C","D"],{
    //       message:"The entered for field:Section is invalid."
    //     }).optional(),
    // }).safeParse(req.body);

    // if(!extraStudentInfo.success){
    //     console.log("Extra Student Info Validation Failed", extraStudentInfo.error);
    //     res.status(400).json({ 
    //         message:"Validation Failed",
    //         error: "Invalid Student Information Type."})
    //     return;
    // }

    const providedData={
        usn,
        name,
        phoneNumber,
        password
    }

    let userData;

    switch(decodeUSN(usn)){
        case 3:
            const admissionYear=Number("20"+usn.slice(3,5));

            userData={
                ...providedData,
                type:"STUDENT",
                admissionYear:admissionYear.toString(),
                department:usn.slice(5,7),
                year,
                semester,
                section,
            }
            break;
        
        case 2:
            userData={
                ...providedData,
                type:getUserType(usn.slice(3,5)),
                department:usn.slice(5,7)
            }
            break;

        case 1:
        case 0:
            userData={
                ...providedData,
                type:getUserType(usn.slice(3,5)),
            }
            break;

        default:
            userData=providedData;
    }

    const response=userSchema.safeParse(userData);

    if (!response.success) {
        res.status(400).json({ 
            message:"Validation Failed",
            error: response.error.flatten() })
        return;
    }

    res.locals.data=response.data;

    next();
}

export const validateLoginUserInput=async (req:Request,res:Response,next:NextFunction)=>{
    const {usn,password}=req.body;

    try{
        const user=await prisma.user.findUnique({
            where:{usn}
        });

        if(!user){
            res.status(400).json({
                success:false,
                message:"This USN is not registered or is not valid."
            })
            return;
        }

        if(user.status==="blocked"){
            res.status(403).json({
                success:false,
                message:"This account is currently blocked."
            })
            return;
        }else if(user.status==="pending"){
            res.status(403).json({
                success:false,
                message:"This account is not yet approved by the ADMIN."
            })
            return;
        }

        if(!(await bcrypt.compare(password,user.password))){
            res.status(400).json({
                success:false,
                message:"Entered password is incorrect."
            })
            return;
        }

        const token={
            id:user.id,
            usn:user.usn,
            type:user.type,
            name:user.name,
            department:user.department,
            admissionYear:user.admissionYear,
            year:user.year,
            semester:user.semester,
            section:user.section,
        }
        res.locals=token;
        next();

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Internal server error."
        })
        return;
    }
}