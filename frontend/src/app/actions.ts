"use server";

import { validateUsnDepartment, type ValidateUsnDepartmentInput, type ValidateUsnDepartmentOutput } from "@/ai/flows/validate-usn-department";

export async function handleAISuggestion(
  data: ValidateUsnDepartmentInput
): Promise<ValidateUsnDepartmentOutput> {
  try {
    const result = await validateUsnDepartment(data);
    return result;
  } catch (error) {
    console.error("Error validating USN/Department:", error);
    return {
      isValid: true, // Or false, depending on how you want to handle AI errors
      reason: "Could not validate USN/Department due to an internal error.",
    };
  }
}
