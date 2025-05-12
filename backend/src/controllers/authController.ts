import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken"
import redis from "../lib/redis";

const TTL=120;      //2 mins

export const sendOtp=async(req:Request,res:Response):Promise<void> =>{
    const {phoneNumber}=req.body;

    const result=z.string().regex(/^\d{10}$/,{
        message:"Phone number must be exactly 10 digits."
    }).safeParse(phoneNumber);

    if(!result.success){
        res.status(400).json({
            success:false,
            message:"Invalid Phone Number"
        })
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    //Logic to send OTP by SMS

    await redis.set(`OTP:${phoneNumber}`, otp, { ex: TTL } );

    res.status(201).json({
        success:true,
        message:`OTP sent to ${phoneNumber}. The OTP is only valid for 2 mins.`
    })
    return;
}

export const validateOtp=async (req:Request,res:Response):Promise<void> =>{
    const {phoneNumber,otp}=req.body;

    const validPhonenumber=z.string().regex(/^\d{10}$/,{
        message:"Phone number must be exactly 10 digits."
    }).safeParse(phoneNumber);

    const validOTP=z.string().regex(/^\d{6}$/,{
        message:"OTP should be 6 digits and should contain only digits."
    }).safeParse(otp);

    if(!validPhonenumber.success){
        res.status(400).json({
            success:false,
            message:"Invalid Phone Number."
        })
        return;
    }else if( !validOTP.success){
        res.status(400).json({
            success:false,
            message:"OTP should be 6 digits and should only contain digits."
        })
        return;
    }

    const generatedOTP=await redis.get(`OTP:${phoneNumber}`);

    if(!generatedOTP){
        res.status(400).json({
            success:false,
            message:"OTP is expired, resend the OTP."
        })
        return;
    }

    if(generatedOTP.toString()!==otp){
        res.status(403).json({
            success:false,
            message:"OTP is incorrect."
        })
        return;
    }

    res.status(200).json({
        success:false,
        message:"Phone Number Verified."
    })
    return;
}

export const appendCookies = (req: Request, res: Response,next:NextFunction): void => {
    const token = res.locals.token;

    const cookie = jwt.sign(token, process.env.JWT_PASS as string, {
        expiresIn: 24 * 60 * 60, // 1 day in seconds
    });

    res.cookie("DigiBulletinCookie", cookie, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day in milliseconds
        sameSite: "strict",
    });

    next();
};