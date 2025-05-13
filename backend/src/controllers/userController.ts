import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs"
import { z } from "zod";

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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id, type, usn, name, department, admissionYear, year, semester, section } = req.body;
    const user=res.locals.userType;

    if(!user || user!=="ADMIN"){
        res.status(403).json({
            success:false,
            message:"Only admin can perform this action."
        })
        return;
    }

  const parsedId = Number(id);
  if (!id || isNaN(parsedId)) {
    res.status(400).json({
      success: false,
      message: "Invalid ID.",
    });
    return;
  }

  const validators = {
    type: z.string().optional(),
    usn: z.string().regex(/^1MS[A-Z0-9]+$/, { message: "Invalid USN format" }).optional(),
    name: z.string().min(3).max(50).optional(),
    department: z.string().optional(),
    admissionYear: z.string().regex(/^\d{4}$/).optional(),
    year: z.number().min(1).max(4).optional(),
    semester: z.number().min(1).max(8).optional(),
    section: z.enum(["A", "B", "C"]).optional(),
  };

  const updateData: Record<string, any> = {};
  try {
    if (type !== undefined) updateData.type = validators.type.parse(type);
    if (usn !== undefined) updateData.usn = validators.usn.parse(usn);
    if (name !== undefined) updateData.name = validators.name.parse(name);
    if (department !== undefined) updateData.department = validators.department.parse(department);
    if (admissionYear !== undefined) updateData.admissionYear = validators.admissionYear.parse(admissionYear);
    if (year !== undefined) updateData.year = validators.year.parse(Number(year));
    if (semester !== undefined) updateData.semester = validators.semester.parse(Number(semester));
    if (section !== undefined) updateData.section = validators.section.parse(section);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      error: error instanceof z.ZodError ? error.flatten() : String(error),
    });
    return;
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({
      success: false,
      message: "No valid fields provided for update.",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parsedId } });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found for this ID.",
      });
      return;
    }

    await prisma.user.update({
      where: { id: parsedId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
    });
    return;
  } catch (e) {
    console.error("Update error:", e);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
};

export const approveUser=async (req:Request,res:Response):Promise<void> =>{
    const {id}=req.body;
    const user=res.locals.userType;

    if(!user || user!=="ADMIN"){
        res.status(403).json({
            success:false,
            message:"Only admin can perform this action."
        })
        return;
    }

    const parsedId = Number(id);
    if (!id || isNaN(parsedId)) {
        res.status(400).json({
        success: false,
        message: "Invalid ID.",
        });
        return;
    }

    try{
        const user=await prisma.user.findUnique({where:{id:parsedId}})
        if (!user) {
            res.status(404).json({
              success: false,
              message: "User not found for this ID.",
            });
            return;
        }

        await prisma.user.update({
            where:{id:parsedId},
            data:{
                status:"approved"
            }
        })

        res.status(200).json({
            success:true,
            message:"User approved successfully."
        })
        return;

    }catch(e){
        res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          return;
    }
}

