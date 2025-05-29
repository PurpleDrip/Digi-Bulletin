import { NextFunction, Request, Response } from "express";
import { audienceGroupSchema, serverSchema } from "../schemas/zodSchema";
import prisma from "../lib/prisma";

export const createServer = async (req: Request, res: Response): Promise<void> => {
  const {ownerId}  = res.locals;

  const response = serverSchema.safeParse(req.body);

  if (!response.success) {
    console.log(response.error?.flatten());
    res.status(400).json({
      success: false,
      message: "Invalid inputs.",
      errors: response.error.flatten(),
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!user) {
    res.status(403).json({
        success: false,
        message: "Invalid Owner ID.",
      });
      return;
    }

    if (response.data.audienceGroups.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one audience group is required.",
      });
      return;
    }    

    const server = await prisma.server.create({
      data: {
        name: response.data.name,
        type: response.data.type,
        about: response.data.about,
        allowAnonymous: response.data.allowAnonymous,
        parent: response.data.parentId ? { connect: { id: response.data.parentId } } : undefined,
        user: { connect: { id: ownerId } },
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
        audience: {
          include: {
            groups: true,
          },
        },
        parent: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Server created successfully.",
      server, 
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
        success: false,
        message: "Unique constraint violation, possibly a duplicate entry.",
    });
    return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  
};

export const appendAudience=async(req:Request,res:Response):Promise<void> =>{
    const { name, ownerId } = req.body;

    const response=audienceGroupSchema.safeParse(req.body);    if(!response.success){
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

export const getServers=async (req:Request,res:Response,next:NextFunction)=>{
  const user = req.body.user;

  try {
    // Fetch all servers the user has access to, in a flat list
    const servers = await prisma.server.findMany({
      where: {
        status: 'approved',
        audience: {
          groups: {
            some: {
              OR: [
                // Direct USN inclusion
                {
                  include: true,
                  usns: { has: user.usn },
                },
                // UserType + Department + Year + Semester + Section
                {
                  include: true,
                  userType: user.type,
                  department: user.department,
                  year: { has: user.year },
                  semester: { has: user.semester },
                  section: { has: user.section },
                },
                // UserType + Department
                {
                  include: true,
                  userType: user.type,
                  department: user.department,
                },
                // UserType only (for global servers)
                {
                  include: true,
                  userType: user.type,
                },
              ],
              // Exclude if explicitly excluded by USN
              NOT: {
                include: false,
                usns: { has: user.usn },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true,
        ownerId: true,
        audienceId: true,
        // Add other fields as needed
      },
    });

    return res.status(200).json({ servers });
  } catch (error) {
    console.error('Error fetching optimized servers:', error);
    return res.status(500).json({ message: 'Server error while fetching servers' });
  }
}
