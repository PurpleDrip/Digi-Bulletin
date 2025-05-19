
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Hash, Users, Building, Loader2, Phone, Send, CalendarPlus, GraduationCap, BookOpen, ALargeSmall, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_TYPES_ARRAY, type UserTypeValue, doesUserTypeNeedDepartment, doesUserTypeNeedStudentInfo, DEPARTMENT_OPTIONS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { usnSchema } from "@/schema/usnSchema";
import { passwordSchema } from "@/schema/passwordSchema";
import { registerUser, sendotp } from "@/api/auth";
import { AxiosError } from "axios";

const registrationFormSchema = z.object({
  usn: usnSchema,
  name: z.string().min(2, "Name must be at least 2 characters."),
  userType: z.enum(USER_TYPES_ARRAY.map(ut => ut.value) as [UserTypeValue, ...UserTypeValue[]], {
    required_error: "Please select a user type.",
  }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. Include country code e.g. +1XXXXXXXXXX"),
  password: passwordSchema,
  confirmPassword: z.string(),
  otp: z.string().length(6, "OTP must be 6 digits."),
  department: z.string().optional(),
  year: z.string().optional(), 
  semester: z.string().optional(),
  yearOfAdmission: z.string().optional(),
  section: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
}).superRefine((data, ctx) => {
  if (doesUserTypeNeedDepartment(data.userType as UserTypeValue)) {
    if (!data.department) {
      ctx.addIssue({
        path: ["department"],
        message: "Please select a department.",
        code: z.ZodIssueCode.custom,
      });
    }
  }

  if (doesUserTypeNeedStudentInfo(data.userType as UserTypeValue)) {
    if (!data.year) {
      ctx.addIssue({ path: ["year"], message: "Year of study is required.", code: z.ZodIssueCode.custom });
    }
    if (!data.semester) {
      ctx.addIssue({ path: ["semester"], message: "Semester is required.", code: z.ZodIssueCode.custom });
    }
    if (!data.yearOfAdmission) {
      ctx.addIssue({ path: ["yearOfAdmission"], message: "Year of Admission is required.", code: z.ZodIssueCode.custom });
    } else if (!/^\d{4}$/.test(data.yearOfAdmission)) {
      ctx.addIssue({ path: ["yearOfAdmission"], message: "Year of admission must be 4 valid digits.", code: z.ZodIssueCode.custom });
    }
    if (!data.section) {
      ctx.addIssue({ path: ["section"], message: "Section is required.", code: z.ZodIssueCode.custom });
    } else if (!/^[A-Za-z0-9]{1,2}$/.test(data.section)) { 
      ctx.addIssue({ path: ["section"], message: "Section should be 1-2 alphanumeric characters.", code: z.ZodIssueCode.custom });
    }
  }
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export function RegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSendingOTP, setIsSendingOTP] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      usn: "",
      name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      otp: "",
      department: "",
      year: "",
      semester: "",
      yearOfAdmission: "",
      section: "",
    },
  });

  const watchedUserType = form.watch("userType") as UserTypeValue | undefined;
  const watchedUsn = form.watch("usn");
  const watchedDepartment = form.watch("department");


  React.useEffect(() => {
    if (watchedUserType) {
      if (!doesUserTypeNeedDepartment(watchedUserType)) {
        form.resetField("department");
        form.clearErrors("department");
      }
      if (!doesUserTypeNeedStudentInfo(watchedUserType)) {
        form.resetField("year");
        form.clearErrors("year");
        form.resetField("semester");
        form.clearErrors("semester");
        form.resetField("yearOfAdmission");
        form.clearErrors("yearOfAdmission");
        form.resetField("section");
        form.clearErrors("section");
      }
    }
  }, [watchedUserType, form]);

  const validateUsnAndDepartment = React.useCallback(async () => {
    const usn = form.getValues("usn");
    const department = form.getValues("department");
    const currentUserType = form.getValues("userType") as UserTypeValue | undefined;
    // TODO: Add your USN and department validation logic here if needed.
  }, [form]);

  React.useEffect(() => {
    const currentUserType = form.getValues("userType") as UserTypeValue | undefined;
    if (doesUserTypeNeedDepartment(currentUserType) && watchedUsn && watchedDepartment && watchedUsn.length >=3) {
        validateUsnAndDepartment();
    }
  }, [watchedUsn, watchedDepartment, form, validateUsnAndDepartment]);


  const handleSendOTP = async () => {
    const phoneNumber = form.getValues("phoneNumber");
    const phoneFieldState = form.getFieldState("phoneNumber");

    if (!phoneNumber || phoneFieldState.invalid) {
      form.setError("phoneNumber", { type: "manual", message: "Please enter a valid phone number to receive OTP."});
      return;
    }

    try{
      setIsSendingOTP(true);
      const registerAttempt=true;
      
      const res = await sendotp(phoneNumber, "",registerAttempt);

      if(res.data.success){
        toast({
          title: "OTP Sent",
          description:res.data.message || `An OTP has been sent to ${phoneNumber}. Check your messages.`,
      });
      }
    }catch(e){
      console.log(e);
    if (e instanceof AxiosError) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "An error occurred while logging in.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred while logging in.",
        variant: "destructive",
      });
    }
    }finally{
      setIsSendingOTP(false);
      setOtpSent(true);
    }
  };

  async function onSubmit(data: RegistrationFormValues) {
    if (!otpSent) {
        toast({
            variant: "destructive",
            title: "OTP Required",
            description: "Please send and verify OTP before registering.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        department: data.department ?? "",
        year: data.year ? Number(data.year) : 0,
        semester: data.semester ? Number(data.semester) : 0,
        yearOfAdmission: data.yearOfAdmission ?? "",
        section: data.section ?? "",
      };

      const res = await registerUser(payload);

      if(res.data.success) {
        toast({
          title: "Registration Successful",
          description: res.data.message || "This account will be activated once verified by the Admin.",
        });
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast({
          title: "Error",
          description: e.response?.data?.message || "An error occurred while registering.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred while registering.",
          variant: "destructive",
        });
      }
    }
    setIsSubmitting(false);

    const submissionData: Partial<RegistrationFormValues> = { ...data };
    if (!doesUserTypeNeedDepartment(data.userType as UserTypeValue)) {
      delete submissionData.department;
    }
    if (!doesUserTypeNeedStudentInfo(data.userType as UserTypeValue)) {
      delete submissionData.year;
      delete submissionData.semester;
      delete submissionData.yearOfAdmission;
      delete submissionData.section;
    }

    form.reset();
    setOtpSent(false);
  }

  const showDepartmentField = watchedUserType ? doesUserTypeNeedDepartment(watchedUserType) : false;
  const showStudentFields = watchedUserType ? doesUserTypeNeedStudentInfo(watchedUserType) : false;

  const yearOfStudyOptions = React.useMemo(() => {
    if (watchedUserType === "STUDENT") {
      return [{ value: "1", label: "1st Year" }, { value: "2", label: "2nd Year" }, { value: "3", label: "3rd Year" }, { value: "4", label: "4th Year" }];
    }
    return [];
  }, [watchedUserType]);

  const semesterOptions = React.useMemo(() => {
    const createSemesterOption = (i: number) => {
        const num = i + 1;
        let suffix = 'th';
        if (num === 1 || (num % 10 === 1 && num % 100 !== 11)) suffix = 'st';
        else if (num === 2 || (num % 10 === 2 && num % 100 !== 12)) suffix = 'nd';
        else if (num === 3 || (num % 10 === 3 && num % 100 !== 13)) suffix = 'rd';
        return { value: num.toString(), label: `${num}${suffix} Semester` };
    };
    if (watchedUserType === "STUDENT") {
      return Array.from({ length: 8 }, (_, i) => createSemesterOption(i));
    }
    return [];
  }, [watchedUserType]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="usn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>USN (University Serial Number)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="e.g., 1MS20CS001" {...field} onBlur={validateUsnAndDepartment} className="pl-10"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Your full name" {...field} className="pl-10"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent>
                  {USER_TYPES_ARRAY.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && (
                <FormDescription>
                  {USER_TYPES_ARRAY.find(ut => ut.value === field.value)?.description}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {showDepartmentField && (
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={(value) => {
                    field.onChange(value);
                    if (form.getValues("usn") && form.getValues("usn").length >=3 && value) {
                        validateUsnAndDepartment();
                    }
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </div>
                  </FormControl>
                  <SelectContent>
                    {DEPARTMENT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} ({option.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showStudentFields && (
          <>
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Study</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select year of study" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      {yearOfStudyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      {semesterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearOfAdmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Admission</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarPlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="number" placeholder="e.g., 2020" {...field} className="pl-10" maxLength={4} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ALargeSmall className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="e.g., A, B1" {...field} className="pl-10" maxLength={2} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="password" placeholder="Enter your password" {...field} className="pl-10" />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                    <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="password" placeholder="Confirm your password" {...field} className="pl-10" />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

         <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <div className="flex items-end gap-2">
                <FormControl className="flex-1">
                  <div className="relative w-full">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="tel" placeholder="12345 67890" {...field} className="pl-10 w-full" disabled={otpSent || isSendingOTP} />
                  </div>
                </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleSendOTP} 
                    disabled={isSendingOTP || otpSent || !form.watch("phoneNumber") || !!form.getFieldState("phoneNumber").error}
                    className="shrink-0"
                  >
                    {isSendingOTP ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSendingOTP ? "Sending..." : "Send OTP"}
                  </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {otpSent && (
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP (One-Time Password)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="text" placeholder="Enter 6-digit OTP" {...field} maxLength={6} className="pl-10"/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting || isSendingOTP }>
          {isSubmitting  || isSendingOTP ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSendingOTP ? "Processing..." : isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
