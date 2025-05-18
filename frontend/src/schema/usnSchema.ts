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