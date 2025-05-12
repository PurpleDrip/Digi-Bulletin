import { NextFunction, Request, Response } from "express";


import decodeUSN from "../utils/decodeUSN";
import getUserType from "../utils/getUserType";
import { userSchema, usnSchema } from "../schemas/zodSchema";

export const validateRegisterUserInput=(req:Request,res:Response,next:NextFunction):void=>{

    const {usn,name,phoneNumber,password}=req.body;

    const result=usnSchema.safeParse(usn);


    if (!result.success) {
        res.status(400).json({ 
            message:"Validation Failed",
            error: result.error.flatten() })
        return;
    }

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
                department:usn.slice(5,7)
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