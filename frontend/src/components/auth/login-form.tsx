"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Hash, Phone, KeyRound, Loader2, Lock } from "lucide-react";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { loginUser, sendotp} from "@/api/auth";
import { useRouter } from "next/navigation";
import { passwordSchema } from "@/schema/passwordSchema";
import { usnSchema } from "@/schema/usnSchema";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { setServer } from "@/store/serverSlice";
import { set } from "date-fns";

const loginFormSchema = z.object({
  usn:usnSchema,
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. Include country code e.g. +1XXXXXXXXXX"),
  password: passwordSchema,
  otp: z.string().length(6, "OTP must be 6 digits."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sendingOtp, setSendingOtp] = React.useState(false);
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [disable,setDisable] = React.useState(true);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),    defaultValues: {
      usn: "",
      phoneNumber: "",
      password: "",
      otp: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    try{
    const res=await loginUser(data);
    console.log("res",res);

    if(res.data.success){
      dispatch(setUser(res.data.data.user));
      dispatch(setServer(res.data.data.server));
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "default",
      });
      router.push("/home");
    }

  } catch (e) {
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
  }
    setIsSubmitting(false);
    setIsOtpSent(false);
    setDisable(true);
    form.reset();
  }

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
                  <Input placeholder="e.g., 1MS20CS001" {...field} className="pl-10"/>
                </div>
              </FormControl>
              <FormMessage />            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    {...field} 
                    className="pl-10"
                  />
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
              <FormLabel>Phone Number</FormLabel>              <FormControl>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="tel" placeholder="12345 67890" {...field} className="pl-10"/>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={async () => {
                      setSendingOtp(true);
                      const usn = form.getValues("usn");
                      const phoneNumber = form.getValues("phoneNumber");
                      
                      if (!usn || !phoneNumber) {
                        toast({
                          title: "Error",
                          description: "Please enter both USN and phone number",
                          variant: "destructive",
                        });
                        return;
                      }

                      try {
                        const res = await sendotp(phoneNumber, usn);

                        if (res.data.success) {
                          setIsOtpSent(true);
                          setDisable(false);
                          toast({
                            title: "OTP Sent",
                            description: "Please check your phone for the OTP",
                          });
                        }
                      } catch (e: any) {
                        console.log(e);
                        toast({
                          title: "Error",
                          description: e?.response?.data?.message || "An error occurred while sending OTP.",
                          variant: "destructive",
                        });
                      }finally{
                        setSendingOtp(false);
                      }
                    }}
                    disabled={isOtpSent || sendingOtp}
                  >
                    {sendingOtp ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isOtpSent ? "OTP Sent" : "Send OTP"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        />        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !isOtpSent || disable}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSubmitting ? "Logging In..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}

