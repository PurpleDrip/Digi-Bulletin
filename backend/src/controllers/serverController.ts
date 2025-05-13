import { Request, Response } from "express";
import { audienceSchema, serverSchema } from "../schemas/zodSchema";
import prisma from "../lib/prisma";

export const createServer=async (req:Request,res:Response):Promise<void> =>{
    // const {audienceYear,audienceSemester,audienceDepartment,audienceUserTypes,audienceUsn}=req.body;
    // const {serverName,serverType,serverAbout,serverAllowAnonymous,serverParentId}=req.body;

    const {ownerId}=res.locals.ownerId;

    const response=audienceSchema.merge(serverSchema).safeParse(req.body);

    if(!response.success){
        console.log(response.error?.flatten())
        res.status(400).json({
            success:false,
            message:"Invalid inputs."
        })
        return;
    }

    try{
        const user= await prisma.user.findFirst({where:{id:ownerId}});

        if(!user){
            res.status(403).json({
                success:false,
                message:"Invalid Owner ID."
            })
            return;
        }

        await prisma.$transaction(async (prisma) => {
            const audienceData = await prisma.audience.create({
                data: {
                    year: response.data.audienceYear,
                    semester: response.data.audienceSemester,
                    department: response.data.audienceDepartment,
                    userTypes: response.data.audienceUserType,
                    usn: response.data.audienceUsn,
                }
            });

            await prisma.server.create({
                data: {
                    ownerId,
                    name: response.data.serverName,
                    type: response.data.serverType,
                    about: response.data.serverAbout,
                    allowAnonymous: response.data.serverAllowAnonymous,
                    parentId: response.data.serverParentId,
                    audienceId: audienceData.id, 
                }
            });
        });

        res.status(201).json({
            success:true,
            message:"Server created Successfully."
        })
        return;
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Internal server error."
        })
        return;
    }
}