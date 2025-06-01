import { NextFunction, Request, Response } from "express";
import { serverSchema } from "../schemas/zodSchema";
import prisma from "../lib/prisma";
import { DptType, Prisma, SectionType } from "@prisma/client";
import { UserType } from '@prisma/client';
import { normalizeAudienceGroups } from "../utils/normalizeAudienceGroups";

export const createServer = async (req: Request, res: Response): Promise<void> => {
  const { id } = res.locals;

  let serverData = req.body;
  const { audienceGroups } = req.body;

  if(serverData.parentId===null){
    serverData.parentId = undefined; 
  }

  serverData.audienceGroups = normalizeAudienceGroups(audienceGroups);
  const response = serverSchema.safeParse(serverData);

  if (!response.success) {
    res.status(400).json({
      success: false,
      message: "Invalid inputs.",
      errors: response.error.flatten(),
    });
    return;
  }

  try {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Owner not found.",
      });
      return;
    }

    // Check if any group has userType: "ALL"
    const isPublic = response.data.audienceGroups.some(
      group => group.userType === "ALL"
    );

    // Validate audience groups if not public
    if (!isPublic && response.data.audienceGroups.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one audience group is required.",
      });
      return;
    }

    // Create server with transaction
    const server = await prisma.$transaction(async (tx) => {
      if (response.data.parentId) {
        const parentExists = await tx.server.count({
          where: { id: response.data.parentId }
        });
        if (!parentExists) throw new Error("Parent server not found");
      }

      // Base server data
      const serverData: any = {
        name: response.data.name,
        type: response.data.type,
        about: response.data.about,
        allowAnonymous: response.data.allowAnonymous,
        parent: response.data.parentId ? { connect: { id: response.data.parentId } } : undefined,
        user: { connect: { id } },
        isPublic: isPublic // Set public flag
      };

      // Only create audience if not public
      if (!isPublic) {
        serverData.audience = {
          create: {
            groups: {
              create: response.data.audienceGroups.map((group) => {

                const validDepartments = Object.values(DptType);
                const validatedDepartment = (group.department ?? [])
                  .filter(dep => validDepartments.includes(dep as DptType))
                  .map(dep => dep as DptType);

                return {
                  include: group.include,
                  userType: group.userType,
                  department: validatedDepartment,
                  year: group.year ?? [],
                  semester: group.semester ?? [],
                  section: group.section ?? [],
                  usns: group.usns ?? []
                };
              })
            }
          }
        };
      }

      const createdServer = await tx.server.create({
        data: serverData,
        include: {
          audience: { include: { groups: true } },
          parent: true
        }
      });

      return createdServer;
    });

    res.status(201).json({
      success: true,
      message: "Server created successfully.",
      server,
    });

  } catch (e) {
    console.error("Server creation error:", e);
    
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: "Server name already exists.",
        });
        return;
      }
    }

    if (e instanceof Error && e.message === "Parent server not found") {
      res.status(400).json({
        success: false,
        message: e.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  
  }
};

export const getUserInfo= async (req:Request,res:Response):Promise<void>=>{
    const userInfo=res.locals;
    let serverIds:number[]|null=null;

    try{
        const server=await prisma.server.findMany({
            where:{
                ownerId:userInfo.id
            }
        })

        if(server){
            serverIds=server.map((server)=>{
                return server.id;
            })
        }

        res.status(200).json({
            success:true,
            message:"User has cookies.",
            data:{
                user:userInfo,
                server:serverIds
            }
        })
        return;
        
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
        return;
    }
}

export const getServers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = res.locals;

  function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }

  const validDepartments = Object.values(DptType);
  const userDepartment = validDepartments.includes(user.department as DptType) 
    ? user.department as DptType 
    : DptType.ALL;

  // Build student OR clause
  const studentOr =
    user.type === "STUDENT"
      ? {
          include: true,
          userType: "STUDENT" as UserType,
          department: {hasSome: [userDepartment, DptType.ALL]  },
          OR: [
            typeof user.year === "number" ? { year: { has: user.year } } : null,
            typeof user.semester === "number" ? { semester: { has: user.semester } } : null,
            user.section ? { section: { has: user.section as SectionType } } : null,
          ].filter(notEmpty),
        }
      : null;

  // Tier 2
  const tier2Or = [
    "ASSISTANT_PROFR",
    "ASSOCIATE_PROFR",
    "PROFR",
    "HOD",
    "CLERKS",
    "COORDINATOR",
  ].includes(user.type)
    ? {
        include: true,
        userType: user.type as UserType,
        department: {hasSome: [userDepartment, DptType.ALL]  }
      }
    : null;

  // Tier 1
  const tier1Or = [
    "PRINCIPAL",
    "DEAN",
    "DIRECTOR",
    "LIBRARIAN",
    "LAB_ASSISTANT",
    "SECURITY_STAFF",
    "JANITORIAL_STAFF",
    "TRANSPORT_STAFF",
    "CAFETERIA_STAFF",
    "LAB_TECHNICIANS",
    "IT_STAFF",
  ].includes(user.type)
    ? {
        include: true,
        userType: user.type as UserType,
      }
    : null;

  // Admin/Guest/Alumini
  const otherOr = ["ADMIN", "GUEST", "ALUMINI"].includes(user.type)
    ? {
        include: true,
        userType: user.type as UserType,
      }
    : null;
  
  const usnCheck={
    include:true,
    usns: { has: user.usn },
  }

  // Final OR array, filtering out nulls
  const audienceOrConditions = [studentOr, tier2Or, tier1Or, otherOr,usnCheck].filter(notEmpty);

  try {
    const servers = await prisma.server.findMany({
      where: {
        OR: [
          { isPublic: true },
          {
            status: "approved",
            audience: {
              groups: {
                some: {
                  OR: audienceOrConditions,
                  NOT: {
                    include: false,
                    usns: { has: user.usn },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        audience: {
          include: {
            groups: true,
          },
        },
      },
    });

    res.status(200).json({ servers });
  } catch (error) {
    console.error("Error fetching servers:", error);
    res.status(500).json({ message: "Server error while fetching servers" });
  }
};

export const getOwnedServers=async (req:Request,res:Response):Promise<void>=>{
    const userInfo=res.locals;

    try{
        const servers=await prisma.server.findMany({
            where:{
                ownerId:userInfo.id,
                status:"approved"
            },
            include:{
                audience:{
                    include:{
                        groups:true
                    }
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Owned servers fetched successfully.",
            data:servers
        })
        return
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
        return;
    }
}





