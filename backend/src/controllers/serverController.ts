import { Request, Response } from "express";
import { serverSchema } from "../schemas/zodSchema";
import prisma from "../lib/prisma";

export const createServer = async (req: Request, res: Response): Promise<void> => {
  const  ownerId  = res.locals.ownerId; // Assuming `ownerId` is set via some middleware.

  // Validate input with Zod schema
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
    // Check if the user exists as the server owner
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

    // Check if audienceGroups is empty
    if (response.data.audienceGroups.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one audience group is required.",
      });
      return;
    }    
    // Create the server
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
