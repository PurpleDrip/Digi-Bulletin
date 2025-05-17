import { ServerType } from "@prisma/client";
import { z } from "zod";

export const usnSchema = z
  .string()
  .regex(/^1MS/, { message: "USN must start with '1MS'" })
  .refine((val) => {
    const fourth = val[3];
    const fifth = val[4];
    const sixth = val[5];
    const seventh = val[6];

    // Tier 3
    if (/\d/.test(fourth) && /\d/.test(fifth)) {
      return val.length === 10;
    }

    // Tier 0
    if (fourth === "X" && /\d{5}$/.test(val.slice(-5))) {
      return true;
    }

    // Tier 1
    if (sixth === "X" && seventh === "X") {
      return /^1MS[A-Z]{2}XX\d{3}$/.test(val);
    }

    // Tier 2
    return /^1MS[A-Z]{2}[A-Z]{2}\d{3}$/.test(val);
  }, {
    message: "Invalid USN structure for known roles"
  });


export const passwordSchema=z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one digit")
    .regex(/[@$!%*?&]/, "Password must include at least one special character (@$!%*?&)");

export const userSchema=z.object({
    usn:usnSchema,
    type:z.enum(["STUDENT","ASSISTANT_PROFR","ASSOCIATE_PROFR","PROFR","HOD","REGISTRAR","CLERKS","COORDINATOR","PRINCIPAL","DEAN",
            "DIRECTOR","LIBRARIAN","LAB_ASSISTANT","SECURITY_STAFF","JANITORIAL_STAFF","TRANSPORT_STAFF","CAFETERIA_STAFF","LAB_TECHNICIANS","IT_STAFF",
            "GUEST","ALUMINI","ADMIN"
        ],{
            message:"This TYPE of user was not found or is invalid."
        }),
    name:z
        .string()
        .min(3, { message: "Name must be at least 3 characters" })
        .max(50, { message: "Name must be at most 50 characters" })
        .regex(/^[A-Za-z\s]+$/, {
        message: "Name can only contain letters and spaces",
        }),
    department:z.enum(["AE","AD","AI","BT","CH","CV","CS","CI","CY","EE","EC","EI","ET","IM","IS","ME","MD","AT"]).optional(),
    admissionYear: z.string().regex(/^\d{4}$/, {
        message: "Admission year must be a 4-digit number"
      }).optional(),
    year:z.number().min(1).max(4).optional(),
    password:passwordSchema,
    phoneNumber:z.string().regex(/^\d{10}$/,{
        message:"Phone number must be exactly 10 digits."
    }),

})

export const audienceGroupSchema = z.array(z.object({
  include:z.boolean(),
  userType: z.enum([
    "STUDENT","ASSISTANT_PROFR","ASSOCIATE_PROFR","PROFR","HOD","REGISTRAR","CLERKS",
    "COORDINATOR","PRINCIPAL","DEAN","DIRECTOR","LIBRARIAN","LAB_ASSISTANT",
    "SECURITY_STAFF","JANITORIAL_STAFF","TRANSPORT_STAFF","CAFETERIA_STAFF",
    "LAB_TECHNICIANS","IT_STAFF","GUEST","ALUMINI","ADMIN"
  ], {
    message: "This TYPE of user was not found or is invalid."
  }),
  department: z.enum([
    "AE","AD","AI","BT","CH","CV","CS","CI","CY","EE",
    "EC","EI","ET","IM","IS","ME","MD","AT"
  ]).optional(),
  year: z.array(z.number()).optional(),
  semester: z.array(z.number().min(1).max(8)).optional(),
  section:z.array(z.enum(["A","B","C","D"],{
    message:"The entered for field:Section is invalid."
  })).optional(),
  usns: z.array(usnSchema).optional(),
}));

export const serverSchema=z.object({
  name:z.string().min(2).max(20),
  type:z.nativeEnum(ServerType),
  about:z.string().min(3).max(35),
  allowAnonymous:z.boolean(),
  parentId:z.number().optional(),
  ownerId:z.number(),
  audienceGroups: audienceGroupSchema,

})