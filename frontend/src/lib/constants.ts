
export const USER_TYPES_CONFIG = {
  UG_STUDENT: { label: "UG Student", description: "Undergraduate student.", needsDepartment: true, needsStudentInfo: true },
  PG_STUDENT: { label: "PG Student", description: "Postgraduate student.", needsDepartment: true, needsStudentInfo: true },

  ASSISTANT_PROFS: { label: "Assistant Professor", description: "Assistant Professor.", needsDepartment: true, needsStudentInfo: false },
  ASSOCIATE_PROFS: { label: "Associate Professor", description: "Associate Professor.", needsDepartment: true, needsStudentInfo: false },
  PROFS: { label: "Professor", description: "Professor.", needsDepartment: true, needsStudentInfo: false },

  HOD: { label: "Head of Department", description: "Head of a specific department.", needsDepartment: true, needsStudentInfo: false },
  REGISTRAR: { label: "Registrar", description: "Administrative head for records.", needsDepartment: false, needsStudentInfo: false }, // Central role, no specific dept in form
  CLERKS: { label: "Clerk", description: "Clerical staff.", needsDepartment: true, needsStudentInfo: false }, // Can be department-specific or central

  PRINCIPAL: { label: "Principal", description: "Head of the institution.", needsDepartment: false, needsStudentInfo: false },
  DEAN: { label: "Dean", description: "Dean of a faculty/school.", needsDepartment: false, needsStudentInfo: false },
  DIRECTOR: { label: "Director", description: "Director of an institute/center.", needsDepartment: false, needsStudentInfo: false },
  LIBRARIAN: { label: "Librarian", description: "Manages library resources.", needsDepartment: false, needsStudentInfo: false },
  LAB_ASSISTANT: { label: "Lab Assistant", description: "Assists in laboratories.", needsDepartment: false, needsStudentInfo: false },
  SECURITY_STAFF: { label: "Security Staff", description: "Ensures campus safety.", needsDepartment: false, needsStudentInfo: false },
  JANITORIAL_STAFF: { label: "Janitorial Staff", description: "Maintains cleanliness.", needsDepartment: false, needsStudentInfo: false },
  TRANSPORT_STAFF: { label: "Transport Staff", description: "Manages transportation.", needsDepartment: false, needsStudentInfo: false },
  CAFETERIA_STAFF: { label: "Cafeteria Staff", description: "Works in the cafeteria.", needsDepartment: false, needsStudentInfo: false },
  LAB_TECHNICIANS: { label: "Lab Technician", description: "Technical support in labs.", needsDepartment: false, needsStudentInfo: false },
  IT_STAFF: { label: "IT Staff", description: "Provides IT support.", needsDepartment: false, needsStudentInfo: false },

  GUEST: { label: "Guest", description: "Temporary visitor.", needsDepartment: false, needsStudentInfo: false },
  ALUMNI: { label: "Alumni", description: "Former student of the institution.", needsDepartment: false, needsStudentInfo: false },
} as const;

export type UserTypeValue = keyof typeof USER_TYPES_CONFIG;

export const USER_TYPES_ARRAY = Object.entries(USER_TYPES_CONFIG).map(([value, { label, description }]) => ({
  value: value as UserTypeValue,
  label,
  description,
}));

export const doesUserTypeNeedDepartment = (userType?: UserTypeValue): boolean => {
  if (!userType || !USER_TYPES_CONFIG[userType]) return false; // Default to false if userType is invalid or not provided
  return USER_TYPES_CONFIG[userType].needsDepartment;
};

export const doesUserTypeNeedStudentInfo = (userType?: UserTypeValue): boolean => {
  if (!userType || !USER_TYPES_CONFIG[userType]) return false;
  return USER_TYPES_CONFIG[userType].needsStudentInfo;
};

export const DEPARTMENT_OPTIONS = [
  { value: "AE", label: "Aerospace Engineering" },
  { value: "AIDS", label: "Artificial Intelligence and Data Science" },
  { value: "AIML", label: "Artificial Intelligence and Machine Learning" },
  { value: "BT", label: "Biotechnology" },
  { value: "CH", label: "Chemical Engineering" },
  { value: "CV", label: "Civil Engineering" },
  { value: "CSE", label: "Computer Science and Engineering" },
  { value: "CSE_AIML", label: "Computer Science and Engineering (AI-ML)" },
  { value: "CSE_CS", label: "Computer Science and Engineering (Cyber Security)" },
  { value: "EEE", label: "Electrical and Electronics Engineering" },
  { value: "ECE", label: "Electronics & Communication Engineering" },
  { value: "EIE", label: "Electronics & Instrumentation Engineering" },
  { value: "ETC", label: "Electronics & Telecommunication Engineering" },
  { value: "IEM", label: "Industrial Engineering & Management" },
  { value: "ISE", label: "Information Science & Engineering" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "MEE", label: "Medical Electronics Engineering" },
] as const;

export type DepartmentValue = typeof DEPARTMENT_OPTIONS[number]['value'];
