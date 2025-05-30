import { NextFunction, Request, Response } from "express";
import { audienceGroupSchema, serverSchema } from "../schemas/zodSchema";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const createServer = async (req: Request, res: Response): Promise<void> => {
  const { id } = res.locals;
  const response = serverSchema.safeParse(req.body);

  if (!response.success) {
    res.status(400).json({
      success: false,
      message: "Invalid inputs.",
      errors: response.error.flatten(),
    });
    return;
  }

  try {
    // Validate owner existence
    const user = await prisma.user.findFirst({ where: { id} });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Owner not found.",
      });
      return;
    }

    // Validate audience groups
    if (response.data.audienceGroups.length === 0) {
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
        
        if (!parentExists) {
          throw new Error("Parent server not found");
        }
      }

      const createdServer = await tx.server.create({
        data: {
          name: response.data.name,
          type: response.data.type,
          about: response.data.about,
          allowAnonymous: response.data.allowAnonymous,
          parent: response.data.parentId ? { connect: { id: response.data.parentId } } : undefined,
          user: { connect: { id } },
          audience: {
            create: {
              groups: {
                create: response.data.audienceGroups.map((group) => ({
                  include: group.include,
                  userType: group.userType,
                  department: group.department ?? null,
                  year: group.year ?? [],
                  semester: group.semester ?? [],
                  section: group.section ?? [],
                  usns: group.usns ?? [],
                })),
              },
            },
          },
        },
        include: {
          audience: { include: { groups: true } },
          parent: true,
        },
      });

      // Additional validation if needed
      if (response.data.parentId) {
        const parentExists = await tx.server.count({ where: { id: response.data.parentId } });
        if (!parentExists) throw new Error("Parent server not found");
      }

      return createdServer;
    });

    res.status(201).json({
      success: true,
      message: "Server created successfully.",
      server,
    });

  } catch (e) {
    console.error("Server creation error:", e);
    
    // Handle specific error cases
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

export const appendAudience=async(req:Request,res:Response):Promise<void> =>{
    const { name, ownerId } = req.body;

    const response=audienceGroupSchema.safeParse(req.body);    
    
    if(!response.success){
        res.status(400).json({
            success:false,
            message:"Invalid input."
        });
        return;
    }
    const newGroups = response.data; 

    const server = await prisma.server.findFirst({
    where: {
        name,
        ownerId,
    },
    include: {
        audience: true,
        },
    });

    if (!server) {
        res.status(404).json({ success: false, message: "Server not found." });
        return;
    }    if (!server.audience) {
    await prisma.audience.create({
        data: {
        servers: { connect: { id: server.id } },
        groups: {
            create: newGroups.map(group => ({
            include: group.include,
            userType: group.userType,
            department: group.department ?? null,
            year: group.year ?? [],
            semester: group.semester ?? [],
            section: group.section ?? [],
            usns: group.usns ?? [],
            })),
        },
        },
    });
    } else if (newGroups && newGroups.length > 0) {
    await prisma.audience.update({
        where: { id: server.audience.id },
        data: {
        groups: {
            create: newGroups.map(group => ({
            include: group.include,
            userType: group.userType,
            department: group.department ?? null,
            year: group.year ?? [],
            semester: group.semester ?? [],
            section: group.section ?? [],
            usns: group.usns ?? [],
            })),
        },
        },
    });
    }

    res.status(200).json({
    success: true,
    message: "Audience groups appended successfully.",
    });
    return;

}

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

export const getServers=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  const user = res.locals;

  const tier2Faculty = [
    'ASSISTANT_PROFR', 'ASSOCIATE_PROFR', 'PROFR', 
    'HOD', 'CLERKS', 'COORDINATOR'
  ];
  
  const tier1Global = [
    'PRINCIPAL', 'DEAN', 'DIRECTOR', 'LIBRARIAN',
    'LAB_ASSISTANT', 'SECURITY_STAFF', 'JANITORIAL_STAFF',
    'TRANSPORT_STAFF', 'CAFETERIA_STAFF', 'LAB_TECHNICIANS', 'IT_STAFF'
  ];

  const buildAudienceGroups = () => {
      if (tier2Faculty.includes(user.type)) {
        return [{
          include: true,
          userType: user.type,
          department: user.department
        },
      {
        include: true,
        userType: user.type
      }];
      }
      
      if (tier1Global.includes(user.type)) {
        return [{
          include: true,
          userType: user.type
        },
      {
        include: true,
        userType: user.type
      }];
      }

      return [{
        include: true,
        userType: user.type
      }];
    };


  try {
    let servers;
    if(user.type==="STUDENT"){
      servers = await prisma.server.findMany({
        where: {
          status: 'approved',
          audience: {
            groups: {
            some: {
              include: true,
              userType: 'STUDENT',
              department: user.department,
              OR: [
                { year: { has: user.year } },
                { semester: { has: user.semester } },
                { section: { has: user.section } }
              ]
            }
            },
          },
        },
    });
    }else{
        servers = await prisma.server.findMany({
          where: {
            status: 'approved',
            audience: {
              groups: {
                some: {
                  OR: buildAudienceGroups(),
                  NOT: {
                    include: false,
                    usns: { has: user.usn },
                  },
                },
              },
            },
          },
    
        });
    }
    res.status(200).json({ servers });
    return;
  } catch (error) {
    console.error('Error fetching optimized servers:', error);
    res.status(500).json({ message: 'Server error while fetching servers' });
    return;
  }
}
